import ModalWrapperChoice from "./ModalWrapperChoice.js";
import PrimaryButton from "../PrimaryButton.js";
const OFFLINE_PROGRESS_TYPE = {
  IMPORTED: 0,
  LOCAL: 1,
  IGNORED: 2,
};
export default {
  name: "ImportSaveModal",
  components: {
    ModalWrapperChoice,
    PrimaryButton
  },
  data() {
    return {
      input: "",
      offlineImport: OFFLINE_PROGRESS_TYPE.IMPORTED,
    };
  },
  computed: {
    saveCheckString() {
      const save = GameSaveSerializer.deserialize(this.input);
      const rawString = GameStorage.checkPlayerObject(save);
      // Keep the length bounded; we don't want the modal to be too big for the screen for particularly bad errors
      return rawString.length > 300 ? `${rawString.slice(0, 297)}...` : rawString;
    },
    player() {
      return this.saveCheckString === "" ? GameSaveSerializer.deserialize(this.input) : undefined;
    },
    progress() {
      return PlayerProgress.of(this.player);
    },
    fileName() {
      return this.player.options.saveFileName;
    },
    antimatter() {
      return this.player.antimatter || this.player.money;
    },
    infinities() {
      // Infinity count data is stored in either player.infinitied or player.infinities based on if the save is before
      // or after the reality update, and this explicit check is needed as it runs before any migration code.
      const infinityData = this.player.infinitied ? this.player.infinitied : this.player.infinities;
      return new Decimal(infinityData);
    },
    hasInput() {
      return this.input !== "";
    },
    inputIsValid() {
      return this.inputIsValidSave;
    },
    inputIsValidSave() {
      return this.player !== undefined;
    },
    isFromFuture() {
      return this.player.lastUpdate > Date.now();
    },
    lastOpened() {
      const ms = Date.now() - this.player.lastUpdate;
      return this.isFromFuture ? `This save is from ${TimeSpan.fromMilliseconds(-ms).toString()} in the future.` : `This save was last opened ${TimeSpan.fromMilliseconds(ms).toString()} ago.`;
    },
  },
  destroyed() {
    // Explicitly setting this to undefined after closing forces the game to fall-back to the stored settings within
    // the player object if this modal is closed - ie. it makes sure actions in the modal don't persist
    GameStorage.offlineEnabled = undefined;
    GameStorage.offlineTicks = undefined;
  },
  methods: {
    importSave() {
      if (!this.inputIsValid) return;
      this.emitClose();
      GameStorage.import(this.input);
    }
  },
  template: `
  <ModalWrapperChoice
    :show-cancel="!inputIsValid"
    :show-confirm="false"
  >
    <template #header>
      Input your save
    </template>
    <input
      ref="input"
      v-model="input"
      type="text"
      class="c-modal-input c-modal-import__input"
      @keyup.enter="importSave"
      @keyup.esc="emitClose"
    >
    <div class="c-modal-import__save-info">
      <template v-if="inputIsValidSave">
        <div v-if="fileName">
          File name: {{ fileName }}
        </div>
        <div>Antimatter: {{ formatPostBreak(antimatter, 2, 1) }}</div>
        <div v-if="progress.isInfinityUnlocked">
          Infinities: {{ formatPostBreak(infinities, 2) }}
        </div>
        <div v-if="progress.isEternityUnlocked">
          Eternities: {{ formatPostBreak(player.eternities, 2) }}
        </div>
        <div v-if="progress.isRealityUnlocked">
          Realities: {{ formatPostBreak(player.realities, 2) }}
        </div>
        <div v-if="progress.hasFullCompletion">
          Full game completions: {{ formatInt(player.records.fullGameCompletions) }}
        </div>
        <br>
        <div>
          {{ lastOpened }}
        </div>
      </template>
      <div v-else-if="hasInput">
        Not a valid save:
        <br>
        {{ saveCheckString }}
      </div>
    </div>

    <PrimaryButton
      v-if="inputIsValid"
      class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
      @click="importSave"
    >
      Import
    </PrimaryButton>
  </ModalWrapperChoice>`
}