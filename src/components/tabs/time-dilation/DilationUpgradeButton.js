import CostDisplay from "../../CostDisplay.js";
import CustomizeableTooltip from "../../CustomizeableTooltip.js";
import DescriptionDisplay from "../../DescriptionDisplay.js";
import EffectDisplay from "../../EffectDisplay.js";
import PrimaryToggleButton from "../../PrimaryToggleButton.js";

export default {
name: "DilationUpgradeButton",
components: {
PrimaryToggleButton,
DescriptionDisplay,
EffectDisplay,
CostDisplay,
CustomizeableTooltip
},
props: {
upgrade: {
type: Object,
required: true
},
isRebuyable: {
type: Boolean,
required: false,
default: false
},
showTooltip: {
type: Boolean,
required: true
}
},
data() {
return {
isBought: false,
isCapped: false,
isAffordable: false,
isAutoUnlocked: false,
isAutobuyerOn: false,
boughtAmount: 0,
currentDT: new Decimal(0),
currentDTGain: new Decimal(0),
timeEstimate: "",
rebuyableBoost: false,
isHovering: false,
hideEstimate: false,
};
},
computed: {
classObject() {
if (this.isUseless) {
// Note: TP mult (3) is conditionally useless and IP mult (7) is always useless; we style them similarly to
// the rest of the game - TP appears as "currently available" while IP appears as "strictly disabled"
return {
"o-dilation-upgrade o-pelle-disabled-pointer": true,
"o-dilation-upgrade--unavailable": this.upgrade.id === 3,
"o-pelle-disabled o-dilation-upgrade--useless": this.upgrade.id === 7,
};
}
return {
"o-dilation-upgrade": true,
"o-dilation-upgrade--rebuyable": this.isRebuyable,
"o-dilation-upgrade--available": !this.isBought && !this.isCapped && this.isAffordable,
"o-dilation-upgrade--unavailable": !this.isBought && !this.isCapped && !this.isAffordable,
"o-dilation-upgrade--bought": this.isBought,
"o-dilation-upgrade--capped": this.isCapped,
};
},
isUseless() {
const tp = this.upgrade.id === 3 && !this.rebuyableBoost;
const ip = this.upgrade.id === 7;
return Pelle.isDoomed && (tp || ip);
}
},
watch: {
isAutobuyerOn(newValue) {
Autobuyer.dilationUpgrade(this.upgrade.id).isActive = newValue;
}
},
methods: {
update() {
const upgrade = this.upgrade;
this.currentDT.copyFrom(Currency.dilatedTime.value);
this.currentDTGain.copyFrom(getDilationGainPerSecond());
this.hideEstimate = this.isAffordable || this.isCapped || this.upgrade.isBought || this.isUseless;
this.timeEstimate = this.hideEstimate ? null : getDilationTimeEstimate(this.upgrade.cost);
if (this.isRebuyable) {
this.isAffordable = upgrade.isAffordable;
this.isCapped = upgrade.isCapped;
const autobuyer = Autobuyer.dilationUpgrade(upgrade.id);
this.boughtAmount = upgrade.boughtAmount;
this.rebuyableBoost = PelleRifts.paradox.milestones[2].canBeApplied;
if (!autobuyer) return;
this.isAutoUnlocked = autobuyer.isUnlocked;
this.isAutobuyerOn = autobuyer.isActive;
return;
}
this.isBought = upgrade.isBought;
if (!this.isBought) {
this.isAffordable = upgrade.isAffordable;
}
}
},
template: `<div class="l-spoon-btn-group">
<button
:ach-tooltip="timeEstimate"
:class="classObject"
@click="upgrade.purchase()"
@mouseover="isHovering = true"
@mouseleave="isHovering = false"
>
<CustomizeableTooltip
v-if="timeEstimate"
:show="showTooltip && !isHovering && !hideEstimate"
left="50%"
top="0"
>
<template #tooltipContent>
{{ timeEstimate }}
</template>
</CustomizeableTooltip>
<span>
<DescriptionDisplay
:config="upgrade.config"
:length="70"
name="o-dilation-upgrade__description"
/>
<EffectDisplay
:key="boughtAmount"
br
:config="upgrade.config"
/>
</span>
<CostDisplay
v-if="!isBought && !isCapped"
br
:config="upgrade.config"
name="Dilated Time"
/>
</button>
<PrimaryToggleButton
v-if="isRebuyable && isAutoUnlocked"
v-model="isAutobuyerOn"
label="Auto:"
class="l--spoon-btn-group__little-spoon o-primary-btn--dilation-upgrade-toggle"
/>
</div>`
}