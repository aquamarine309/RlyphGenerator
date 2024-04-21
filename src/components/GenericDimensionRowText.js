export default {
name: "GenericDimensionRowText",
props: {
tier: {
type: Number,
required: true
},
name: {
type: String,
required: true
},
multiplierText: {
type: String,
required: true
},
amountText: {
type: String,
required: true
},
rate: {
type: Object,
required: true
},
},
data() {
return {
isSmall: 0,
};
},
computed: {
rateText() {
return this.rate.neq(0)
? ` (+${format(this.rate, 2, 2)}%/s)`
: "";
},
showPercentage() {
return player.options.showHintText.showPercentage || ui.view.shiftDown;
},

},
methods: {
update() {
// Needs to be reactive or else rows that don't have changing values (eg. the highest dimension and any higher
// locked ones) won't change layout when the window size changes
this.isSmall = window.innerWidth < 1573;
},
adjustableTextClass() {
return {
"l-narrow-box": this.isSmall,
"l-wide-box": !this.isSmall,
};
}
},
template: `<div class="l-dimension-text-container">
<div :class="adjustableTextClass()">
<span class="c-dim-row__large">
{{ name }}
</span>
<span class="c-dim-row__small">
{{ multiplierText }}
</span>
</div>
<div :class="adjustableTextClass()">
<span class="c-dim-row__large">
{{ amountText }}
</span>
<span
v-if="rate.neq(0) && showPercentage"
class="c-dim-row__small"
>
{{ rateText }}
</span>
</div>
</div>`
}