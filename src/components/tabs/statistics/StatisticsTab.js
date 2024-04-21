import PrimaryButton from "../../PrimaryButton.js";
import GlyphSetPreview from "../../GlyphSetPreview.js";

export default {
  name: "StatisticsTab",
  components: {
    PrimaryButton,
    GlyphSetPreview
  },
  data() {
    return {
      glyphs: [],
      initialSeed: 0,
      realities: 0,
      antimatter: new Decimal(0)
    };
  },
  methods: {
    update() {
      this.glyphs = GlyphSelection.glyphList(GlyphSelection.choiceCount, gainedGlyphLevel(), { isChoosingGlyph: false });
      this.initialSeed = player.reality.initialSeed;
      this.realities = player.realities;
      this.antimatter = Currency.antimatter.value;
    },
    show() {
      if (player.realities <= 0) {
        Modal.message.show("请先现实一次。");
        return;
      };
      Modal.glyphShowcasePanel.show({
        name: "获得的符文",
        glyphSet: this.glyphs,
        closeEvent: GAME_EVENT.GLYPHS_EQUIPPED_CHANGED,
      });
    }
  },
  template: `
  <div class="c-stats-tab">
    <PrimaryButton onclick="Modal.import.show()">导入存档</PrimaryButton>
    <PrimaryButton @click="show">获得的符文</PrimaryButton>
    <p>初始种子: {{ formatInt(initialSeed) }}.</p>
    <p>现实次数: {{ formatInt(realities) }}.</p>
    <p>反物质: {{ format(antimatter, 2, 1) }}.</p>
  </div>
  `
}