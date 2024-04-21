import { GameMechanicState, SetPurchasableMechanicState } from "./game-mechanics/index.js";
import { DC } from "./constants.js";

export function gainedEternities() {
  return Pelle.isDisabled("eternityMults")
    ? new Decimal(1)
    : new Decimal(getAdjustedGlyphEffect("timeetermult"))
      .timesEffectsOf(RealityUpgrade(3), Achievement(113))
      .pow(AlchemyResource.eternity.effectValue);
}

export class EternityMilestoneState {
  constructor(config) {
    this.config = config;
  }

  get isReached() {
    if (Pelle.isDoomed && this.config.givenByPelle) {
      return this.config.givenByPelle();
    }
    return Currency.eternities.gte(this.config.eternities);
  }
}
export const EternityMilestone = mapGameDataToObject(
  GameDatabase.eternity.milestones,
  config => (config.isBaseResource
    ? new EternityMilestoneState(config)
    : new EternityMilestoneState(config))
);

class EternityUpgradeState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.eternityPoints;
  }

  get set() {
    return player.eternityUpgrades;
  }
}

class EPMultiplierState extends GameMechanicState {
  constructor() {
    super({});
    this.cachedCost = new Lazy(() => this.costAfterCount(player.epmultUpgrades));
    this.cachedEffectValue = new Lazy(() => DC.D5.pow(player.epmultUpgrades));
  }

  get isAffordable() {
    return !Pelle.isDoomed && Currency.eternityPoints.gte(this.cost);
  }

  get cost() {
    return this.cachedCost.value;
  }

  get boughtAmount() {
    return player.epmultUpgrades;
  }

  set boughtAmount(value) {
    // Reality resets will make this bump amount negative, causing it to visually appear as 0 even when it isn't.
    // A dev migration fixes bad autobuyer states and this change ensures it doesn't happen again
    const diff = Math.clampMin(value - player.epmultUpgrades, 0);
    player.epmultUpgrades = value;
    this.cachedCost.invalidate();
    this.cachedEffectValue.invalidate();
    Autobuyer.eternity.bumpAmount(DC.D5.pow(diff));
  }

  get isCustomEffect() {
    return true;
  }

  get effectValue() {
    return this.cachedEffectValue.value;
  }

  purchase() {
    if (!this.isAffordable) return false;
    Currency.eternityPoints.subtract(this.cost);
    ++this.boughtAmount;
    return true;
  }

  buyMax(auto) {
    if (!this.isAffordable) return false;
    if (RealityUpgrade(15).isLockingMechanics) {
      if (!auto) RealityUpgrade(15).tryShowWarningModal();
      return false;
    }
    const bulk = bulkBuyBinarySearch(Currency.eternityPoints.value, {
      costFunction: this.costAfterCount,
      cumulative: true,
      firstCost: this.cost,
    }, this.boughtAmount);
    if (!bulk) return false;
    Currency.eternityPoints.subtract(bulk.purchasePrice);
    this.boughtAmount += bulk.quantity;
    return true;
  }

  reset() {
    this.boughtAmount = 0;
  }

  get costIncreaseThresholds() {
    return [DC.E100, Decimal.NUMBER_MAX_VALUE, DC.E1300, DC.E4000];
  }

  costAfterCount(count) {
    const costThresholds = EternityUpgrade.epMult.costIncreaseThresholds;
    const multPerUpgrade = [50, 100, 500, 1000];
    for (let i = 0; i < costThresholds.length; i++) {
      const cost = Decimal.pow(multPerUpgrade[i], count).times(500);
      if (cost.lt(costThresholds[i])) return cost;
    }
    return DC.E3.pow(count + Math.pow(Math.clampMin(count - 1334, 0), 1.2)).times(500);
  }
}

export const EternityUpgrade = mapGameDataToObject(
  GameDatabase.eternity.upgrades,
  config => new EternityUpgradeState(config)
);

EternityUpgrade.epMult = new EPMultiplierState();
