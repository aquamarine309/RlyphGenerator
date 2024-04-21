import ImportSaveModal from "../components/modals/ImportSaveModal.js";
import MessageModal from "../components/modals/MessageModal.js";
import GlyphShowcasePanelModal from "../components/modals/GlyphShowcasePanelModal.js";
let nextModalID = 0;
export class Modal {
  constructor(component, priority = 0, closeEvent) {
    this._component = component;
    this._modalConfig = {};
    this._priority = priority;
    this._closeEvent = closeEvent;
  }

  // We can't handle this in the Vue components because if the modal order changes, all the event listeners from the
  // top modal end up getting removed from the EventHub due to the component being temporarily destroyed. This could
  // result in the component sticking around because an event it was listening for happened while it wasn't on top.
  applyCloseListeners(closeEvent) {
    // Most of the time the close event will be a prestige event, in which case we want it to trigger on all higher
    // prestiges as well
    const prestigeOrder = [];
    let shouldClose = false;
    for (const prestige of prestigeOrder) {
      if (prestige === closeEvent) shouldClose = true;
      if (shouldClose) EventHub.ui.on(prestige, () => this.removeFromQueue(), this._component);
    }

    // In a few cases we want to trigger a close based on a non-prestige event, so if the specified event wasn't in
    // the prestige array above, we just add it on its own
    if (!shouldClose) EventHub.ui.on(closeEvent, () => this.removeFromQueue(), this._component);
  }

  show(modalConfig) {
    if (!GameUI.initialized) return;
    this._uniqueID = nextModalID++;
    this._props = Object.assign({}, modalConfig || {});
    if (this._closeEvent) this.applyCloseListeners(this._closeEvent);
    if (modalConfig?.closeEvent) this.applyCloseListeners(modalConfig.closeEvent);

    const modalQueue = ui.view.modal.queue;
    // Add this modal to the front of the queue and sort based on priority to ensure priority is maintained.
    modalQueue.unshift(this);
    Modal.sortModalQueue();
  }

  get isOpen() {
    return ui.view.modal.current === this;
  }

  get component() {
    return this._component;
  }

  get props() {
    return this._props;
  }

  get priority() {
    return this._priority;
  }

  removeFromQueue() {
    EventHub.ui.offAll(this._component);
    ui.view.modal.queue = ui.view.modal.queue.filter(m => m._uniqueID !== this._uniqueID);
    if (ui.view.modal.queue.length === 0) ui.view.modal.current = undefined;
    else ui.view.modal.current = ui.view.modal.queue[0];
  }

  static sortModalQueue() {
    const modalQueue = ui.view.modal.queue;
    modalQueue.sort((x, y) => y.priority - x.priority);
    // Filter out multiple instances of the same modal.
    const singleQueue = [...new Set(modalQueue)];
    ui.view.modal.queue = singleQueue;
    ui.view.modal.current = singleQueue[0];
  }

  static hide() {
    if (!GameUI.initialized) return;
    ui.view.modal.queue.shift();
    if (ui.view.modal.queue.length === 0) ui.view.modal.current = undefined;
    else ui.view.modal.current = ui.view.modal.queue[0];
    ui.view.modal.cloudConflict = [];
  }

  static hideAll() {
    if (!GameUI.initialized) return;
    while (ui.view.modal.queue.length) {
      if (ui.view.modal.queue[0].hide) {
        ui.view.modal.queue[0].hide();
      } else {
        Modal.hide();
      }
    }
    ui.view.modal.current = undefined;
  }

  static get isOpen() {
    return ui.view.modal.current instanceof this;
  }
}

class ChallengeConfirmationModal extends Modal {
  show(id) {
    super.show({ id });
  }
}

class TimeModal extends Modal {
  show(diff) {
    super.show({ diff });
  }
}
Modal.import = new Modal(ImportSaveModal);
Modal.glyphShowcasePanel = new Modal(GlyphShowcasePanelModal);

function getSaveInfo(save) {
  const resources = {
    realTimePlayed: 0,
    totalAntimatter: new Decimal(0),
    infinities: new Decimal(0),
    eternities: new Decimal(0),
    realities: 0,
    infinityPoints: new Decimal(0),
    eternityPoints: new Decimal(0),
    realityMachines: new Decimal(0),
    imaginaryMachines: 0,
    dilatedTime: new Decimal(0),
    bestLevel: 0,
    pelleAM: new Decimal(0),
    remnants: 0,
    realityShards: new Decimal(0),
    // This is a slight workaround to hide DT/level once Doomed
    pelleLore: 0,
    saveName: "",
    compositeProgress: 0,
  };
  // This code ends up getting run on raw save data before any migrations are applied, so we need to default to props
  // which only exist on the pre-reality version when applicable. Note that new Decimal(undefined) gives zero.
  resources.realTimePlayed = save.records?.realTimePlayed ?? 100 * save.totalTimePlayed;
  resources.totalAntimatter.copyFrom(new Decimal(save.records?.totalAntimatter));
  resources.infinities.copyFrom(new Decimal(save.infinities));
  resources.eternities.copyFrom(new Decimal(save.eternities));
  resources.realities = save.realities ?? 0;
  resources.infinityPoints.copyFrom(new Decimal(save.infinityPoints));
  resources.eternityPoints.copyFrom(new Decimal(save.eternityPoints));
  resources.realityMachines.copyFrom(new Decimal(save.reality?.realityMachines));
  resources.imaginaryMachines = save.reality?.iMCap ?? 0;
  // Use max DT instead of current DT because spending it can cause it to drop and trigger the conflict modal
  // unnecessarily. We only use current DT as a fallback (eg. loading a save from pre-reality versions)
  resources.dilatedTime.copyFrom(new Decimal(save.records?.thisReality.maxDT ?? (save.dilation?.dilatedTime ?? 0)));
  resources.bestLevel = save.records?.bestReality.glyphLevel ?? 0;
  resources.pelleAM.copyFrom(new Decimal(save.celestials?.pelle.records.totalAntimatter));
  resources.remnants = save.celestials?.pelle.remnants ?? 0;
  resources.realityShards.copyFrom(new Decimal(save.celestials?.pelle.realityShards));
  resources.pelleLore = save.celestials?.pelle.quoteBits ?? 0;
  resources.saveName = save.options?.saveFileName ?? "";
  resources.compositeProgress = ProgressChecker.getCompositeProgress(save);

  return resources;
}
Modal.message = new class extends Modal {
  show(text, props = {}, messagePriority = 0) {
    if (!GameUI.initialized) return;
    // It might be zero, so explicitly check for undefined
    if (this.currPriority === undefined) this.currPriority = messagePriority;
    else if (messagePriority < this.currPriority) return;

    super.show();
    this.message = text;
    this.callback = props.callback;
    this.closeButton = props.closeButton ?? false;
    EventHub.ui.offAll(this._component);
    if (props.closeEvent) this.applyCloseListeners(props.closeEvent);
  }

  hide() {
    EventHub.ui.offAll(this._component);
    this.currPriority = undefined;
    Modal.hide();
  }
}(MessageModal, 2);
