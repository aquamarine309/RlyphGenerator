
import ExpandingControlBox from "../../ExpandingControlBox.js";

export default {
  name: "PelleStrike",
  components: {
    ExpandingControlBox
  },
  props: {
    strike: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      strikeReward: ""
    };
  },
  methods: {
    update() {
      this.strikeReward = this.strike.reward();
    }
  },
template: `<div class="c-pelle-strike-container">
    <ExpandingControlBox container-class="c-pelle-strike">
      <template #header>
        <div class="c-pelle-strike-header">
          ▼ {{ strike.requirement }} ▼
        </div>
      </template>
      <template #dropdown>
        <div class="c-pelle-strike-dropdown">
          <span>Penalty: {{ strike.penalty }}</span>
          <br>
          <span>Reward: {{ strikeReward }}</span>
        </div>
      </template>
    </ExpandingControlBox>
  </div>`
  }