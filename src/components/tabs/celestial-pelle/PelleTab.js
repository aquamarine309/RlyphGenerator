import CelestialQuoteHistory from "../../CelestialQuoteHistory.js";
import GalaxyGeneratorPanel from "./PelleGalaxyGeneratorPanel.js";
import PelleBarPanel from "./PelleBarPanel.js";
import PelleUpgradePanel from "./PelleUpgradePanel.js";

export default {
name: "PelleTab",
components: {
PelleBarPanel,
PelleUpgradePanel,
GalaxyGeneratorPanel,
CelestialQuoteHistory
},
data() {
return {
isDoomed: false,
canEnterPelle: false,
completedRows: 0,
cappedResources: 0,
hasStrike: false,
hasGalaxyGenerator: false
};
},
computed: {
symbol() {
return Pelle.symbol;
},
totalRows() {
return Achievements.prePelleRows.length;
},
totalAlchemyResources() {
return AlchemyResources.all.length;
}
},
methods: {
update() {
this.isDoomed = Pelle.isDoomed;
if (!this.isDoomed) {
this.completedRows = Achievements.prePelleRows.countWhere(r => r.every(a => a.isUnlocked));
this.cappedResources = AlchemyResources.all.countWhere(r => r.capped);
this.canEnterPelle = this.completedRows === this.totalRows &&
this.cappedResources === this.totalAlchemyResources;
}
this.hasStrike = PelleStrikes.all.some(s => s.hasStrike);
this.hasGalaxyGenerator = PelleRifts.recursion.milestones[2].canBeApplied || GalaxyGenerator.spentGalaxies > 0;
},
toggleBought() {
Pelle.cel.showBought = !Pelle.cel.showBought;
this.$recompute("upgrades");
},
showModal() {
Modal.pelleEffects.show();
},
enterDoomModal() {
Modal.armageddon.show();
}
},
template: `<div class="l-pelle-celestial-tab">
<div
v-if="isDoomed"
class="l-pelle-all-content-container"
>
<CelestialQuoteHistory celestial="pelle" />
<div class="button-container">
<button
class="o-pelle-button"
@click="showModal"
>
Show effects in Doomed Reality
</button>
</div>
<br>
<GalaxyGeneratorPanel v-if="hasGalaxyGenerator" />
<PelleBarPanel v-if="hasStrike" />
<PelleUpgradePanel />
</div>
<button
v-else-if="canEnterPelle"
class="pelle-doom-button"
@click="enterDoomModal"
>
Doom<br>Your<br>Reality
<div class="pelle-icon-container">
<span class="pelle-icon">{{ symbol }}</span>
</div>
</button>
<div
v-else
class="pelle-unlock-requirements"
>
You must have {{ formatInt(totalRows) }} rows of Achievements
and all of your Glyph Alchemy Resources capped to unlock Pelle, Celestial of Antimatter.
<br>
<br>
{{ formatInt(completedRows) }} / {{ formatInt(totalRows) }} Achievement rows completed
<br>
{{ formatInt(cappedResources) }} / {{ formatInt(totalAlchemyResources) }} capped Alchemy Resources
</div>
</div>`
}
