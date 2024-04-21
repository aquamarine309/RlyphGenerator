export default {
  name: "PopupModal",
  props: {
    modal: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      showModal: false,
      positionStyle: {},
    };
  },
  created() {
    this.on$(GAME_EVENT.CLOSE_MODAL, this.hide);
  },
  mounted() {
    this.updatePositionStyles();
  },
  destroyed() {
    document.activeElement.blur();
  },
  methods: {
    update() {
      if (!this.showModal) {
        this.showModal = true;
        this.$nextTick(() => this.updatePositionStyles());
      } else {
        this.updatePositionStyles();
      }
    },
    updatePositionStyles() {
      if (!this.$refs.modal) return;
      if (!this.showModal || this.$viewModel.theme !== "S12") {
        this.positionStyle = {};
        return;
      }
      const w = this.$refs.modal.offsetWidth, h = this.$refs.modal.offsetHeight;
      // We need to set position style specifically for S12 because using a transform messes things up and
      // makes everything really blurry
      this.positionStyle = {
        left: `${Math.round(innerWidth / 2 - w / 2)}px`,
        top: `${Math.round(innerHeight / 2 - h / 2)}px`,
        transform: "none",
      };
    },
    hide() {
      if (!this.modal.isOpen) return;
      if (this.modal.hide) this.modal.hide();
      else Modal.hide();
    }
  },
  template: `<div
v-if="showModal"
ref="modal"
class="c-modal l-modal"
:style="positionStyle"
>
<component
:is="modal.component"
v-bind="modal.props"
@close="hide"
/>
</div>`
}