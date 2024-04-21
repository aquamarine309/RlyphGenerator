import TabComponents from "./tabs/index.js";
import GameUiComponentFixed from "./GameUiComponentFixed.js";

export default {
  name: "GameUIComponent",
  components: {
    ...TabComponents,
    GameUiComponentFixed
  },
  computed: {
    view() {
      return this.$viewModel;
    },
    containerClass() {
      return "new-ui";
    },
    page() {
      const subtab = Tabs.current[this.$viewModel.subtab];
      return subtab.config.component;
    },
    themeCss() {
      return `./public/stylesheets/theme-${this.view.theme}.css`;
    }
  },
  template: `<div
    v-if="view.initialized"
    id="ui-container"
    :class="containerClass"
    class="ui-wrapper"
  >
    <div
      id="ui"
      class="c-game-ui"
    >
      <component
        :is="page"
        class="c-game-tab"
      />
      <link
        v-if="view.theme !== 'Normal'"
        type="text/css"
        rel="stylesheet"
        :href="themeCss"
      >
    </div>
    <GameUiComponentFixed />
  </div>`
};
  