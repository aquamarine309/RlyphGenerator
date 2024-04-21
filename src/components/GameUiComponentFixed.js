import PopupModal from "./modals/PopupModal.js";

export default {
  name: "GameUiComponentFixed",
  components: {
    PopupModal
  },
  computed: {
    view() {
      return this.$viewModel;
    }
  },
  template: `
<div
id="ui-fixed"
class="c-game-ui--fixed"
>
<PopupModal
v-if="view.modal.current"
:modal="view.modal.current"
/>
</div>`
}