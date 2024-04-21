import wordShift from "../../../core/word-shift.js";

import PelleUpgrade from "./PelleUpgrade.js";

export default {
name: "GalaxyGeneratorPanel",
components: {
PelleUpgrade
},
data() {
return {
isUnlocked: false,
galaxies: 0,
generatedGalaxies: 0,
galaxiesPerSecond: 0,
cap: 0,
isCapped: false,
capRift: null,
sacrificeActive: false,
isCollapsed: false,
barWidth: 0,
capRiftName: "",
};
},
computed: {
collapseIcon() {
return this.isCollapsed
? "fas fa-expand-arrows-alt"
: "fas fa-compress-arrows-alt";
},
upgrades() {
return GalaxyGeneratorUpgrades.all;
},
galaxyText() {
let text = format(Math.max(this.galaxies, 0), 2);
if (this.galaxies < 0) text += ` [${format(this.galaxies, 2)}]`;
return text;
},
sacrificeText() {
return this.capRift.galaxyGeneratorText.replace("$value", this.capRiftName);
},
emphasisedStart() {
return Math.pow(this.generatedGalaxies / this.cap, 0.45);
}
},
methods: {
update() {
this.isUnlocked = Pelle.hasGalaxyGenerator;
this.isCapped = GalaxyGenerator.isCapped;
this.isCollapsed = player.celestials.pelle.collapsed.galaxies && !this.isCapped;
if (this.isCollapsed || !this.isUnlocked) return;
this.galaxies = player.galaxies + GalaxyGenerator.galaxies;
this.generatedGalaxies = GalaxyGenerator.generatedGalaxies;
this.galaxiesPerSecond = GalaxyGenerator.gainPerSecond;
this.cap = GalaxyGenerator.generationCap;
this.capRift = GalaxyGenerator.capRift;
this.sacrificeActive = GalaxyGenerator.sacrificeActive;
this.barWidth = (this.isCapped ? this.capRift.reducedTo : this.emphasisedStart);
if (this.capRift) this.capRiftName = wordShift.wordCycle(this.capRift.name);
},
increaseCap() {
if (GalaxyGenerator.isCapped) GalaxyGenerator.startSacrifice();
},
toggleCollapse() {
player.celestials.pelle.collapsed.galaxies = !this.isCollapsed;
},
unlock() {
player.celestials.pelle.galaxyGenerator.unlocked = true;
Pelle.quotes.galaxyGeneratorUnlock.show();
}
},
template: `<div class="l-pelle-panel-container">
<div class="c-pelle-panel-title">
<i
v-if="!isCapped"
:class="collapseIcon"
class="c-collapse-icon-clickable"
@click="toggleCollapse"
/>
Galaxy Generator
</div>
<div
v-if="!isCollapsed"
class="l-pelle-content-container"
>
<div v-if="isUnlocked">
<div>
You have a total of
<span class="c-galaxies-amount">{{ galaxyText }}</span>
Galaxies.
<span class="c-galaxies-amount">+{{ format(galaxiesPerSecond, 2, 1) }}/s</span>
</div>
<div>
<button
class="c-increase-cap"
:class="{
'c-increase-cap-available': isCapped && capRift && !sacrificeActive,
'tutorial--glow': cap === Infinity
}"
@click="increaseCap"
>
<div
class="c-increase-cap-background"
:style="{ 'width': \`\${barWidth * 100}%\` }"
/>
<div
v-if="isCapped && capRift"
class="c-increase-cap-text"
>
{{ sacrificeText }}. <br><br>
<span
v-if="!sacrificeActive"
class="c-big-text"
>
Sacrifice your {{ capRiftName }}
</span>
<span
v-else
class="c-big-text"
>
Getting rid of all that {{ capRiftName }}...
</span>
</div>
<div
v-else
class="c-increase-cap-text c-medium-text"
>
{{ format(generatedGalaxies, 2) }} / {{ format(cap, 2) }} Galaxies generated
</div>
</button>
</div>
<div class="l-galaxy-generator-upgrades-container">
<PelleUpgrade
v-for="upgrade in upgrades"
:key="upgrade.config.id"
:upgrade="upgrade"
:galaxy-generator="true"
/>
</div>
</div>
<button
v-else
class="c-generator-unlock-button"
@click="unlock"
>
Unlock the Galaxy Generator
</button>
</div>
</div>`
}
