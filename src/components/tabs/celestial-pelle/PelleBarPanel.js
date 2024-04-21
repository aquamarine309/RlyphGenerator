import PelleRift from "./PelleRift.js";

export default {
name: "PelleBarPanel",
components: {
PelleRift
},
data() {
return {
decayRate: 0,
isCollapsed: false,
};
},
computed: {
collapseIcon() {
return this.isCollapsed
? "fas fa-expand-arrows-alt"
: "fas fa-compress-arrows-alt";
},
strikes() {
return PelleStrikes.all;
}
},
methods: {
update() {
this.decayRate = Pelle.riftDrainPercent;
this.isCollapsed = player.celestials.pelle.collapsed.rifts;
},
toggleCollapse() {
player.celestials.pelle.collapsed.rifts = !this.isCollapsed;
},
},
template: `<div class="l-pelle-panel-container">
<div class="c-pelle-panel-title">
<i
:class="collapseIcon"
class="c-collapse-icon-clickable"
@click="toggleCollapse"
/>
Pelle Strikes and Rifts
</div>
<div
v-if="!isCollapsed"
class="l-pelle-content-container"
>
Rifts can be activated by clicking on their bars.
<span v-if="strikes.length > 1">You cannot activate more than two Rifts at once.</span>
<br v-else>
When active, Rifts consume {{ formatPercents(decayRate) }} of another resource per second.
<br>
Rift effects apply even when not activated, and are based on the total amount drained.
<b class="o-strike-warning">Pelle Strike penalties are permanent and remain active even after Armageddon!</b>
<div class="c-pelle-bar-container">
<PelleRift
v-for="strike in strikes"
:key="strike.config.id"
:strike="strike"
/>
</div>
</div>
</div>`
}
