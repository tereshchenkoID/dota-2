# Roshan Gauntlet balance simulation

Seed: 20261016. 10,000 runs per strategy (40,000 total).

| Strategy | Mean stage | Median | Max | Mean bosses | Mean spins | Estimated duration | HP defeat | Spins defeat |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| random | 3.11 | 3 | 8 | 2.11 | 49.8 | 89 s | 36.6% | 63.4% |
| damage | 3.13 | 3 | 8 | 2.13 | 47.9 | 87 s | 46.7% | 53.3% |
| defensive | 3.13 | 3 | 8 | 2.13 | 51.4 | 92 s | 29.9% | 70.1% |
| balanced | 3.16 | 3 | 9 | 2.16 | 50.3 | 90 s | 40.5% | 59.6% |

Duration is an estimate: 1.45 seconds per animated spin and 8 seconds per reward choice, not measured human play time. Rune outcomes are observational and depend on stage and selection strategy; they do not establish causal advantage. A 500-stage simulation guard is reported as censored, never counted as a defeat. The game itself has no stage limit.

## random

End-stage distribution: 1: 1484, 2: 1825, 3: 2596, 4: 2603, 5: 1258, 6: 198, 7: 34, 8: 2. Censored: 0.

| Reward | Offered | Selected | Selection when offered |
|---|---:|---:|---:|
| blade-mastery | 2965 | 995 | 33.6% |
| critical-power | 3027 | 1032 | 34.1% |
| arcane-knowledge | 2923 | 963 | 32.9% |
| fortified-armor | 5767 | 1894 | 32.8% |
| extra-charges | 3007 | 978 | 32.5% |
| vitality | 5653 | 1916 | 33.9% |
| battle-recovery | 5613 | 1910 | 34.0% |
| artifact-mastery | 3041 | 1038 | 34.1% |
| roshan-hunter | 3008 | 1009 | 33.5% |
| second-wind | 1042 | 339 | 32.5% |
| double-damage | 1036 | 320 | 30.9% |
| regeneration | 5727 | 1934 | 33.8% |
| haste | 3017 | 1006 | 33.3% |
| arcane | 2995 | 1029 | 34.4% |
| invisibility | 5676 | 1881 | 33.1% |
| shield | 5698 | 1857 | 32.6% |
| illusion | 3003 | 965 | 32.1% |

| Rune | Stages | Clear rate | Mean damage | Mean spins |
|---|---:|---:|---:|---:|
| illusion | 965 | 58.1% | 897.0 | 15.5 |
| shield | 1857 | 60.9% | 918.4 | 17.0 |
| regeneration | 1934 | 64.6% | 944.5 | 17.4 |
| arcane | 1029 | 59.9% | 901.7 | 14.9 |
| invisibility | 1881 | 55.9% | 883.8 | 16.6 |
| double-damage | 320 | 66.6% | 922.0 | 13.6 |
| haste | 1006 | 63.2% | 904.0 | 16.9 |

## damage

End-stage distribution: 1: 1547, 2: 1536, 3: 2562, 4: 2978, 5: 1185, 6: 171, 7: 19, 8: 2. Censored: 0.

| Reward | Offered | Selected | Selection when offered |
|---|---:|---:|---:|
| blade-mastery | 3008 | 2290 | 76.1% |
| critical-power | 3076 | 2329 | 75.7% |
| arcane-knowledge | 3034 | 2310 | 76.1% |
| fortified-armor | 5824 | 63 | 1.1% |
| extra-charges | 3035 | 1242 | 40.9% |
| vitality | 5656 | 145 | 2.6% |
| battle-recovery | 5661 | 161 | 2.8% |
| artifact-mastery | 3030 | 1018 | 33.6% |
| roshan-hunter | 3003 | 1402 | 46.7% |
| second-wind | 1091 | 48 | 4.4% |
| double-damage | 1037 | 772 | 74.4% |
| regeneration | 5800 | 992 | 17.1% |
| haste | 3033 | 2288 | 75.4% |
| arcane | 3071 | 2371 | 77.2% |
| invisibility | 5777 | 808 | 14.0% |
| shield | 5775 | 770 | 13.3% |
| illusion | 3040 | 2308 | 75.9% |

| Rune | Stages | Clear rate | Mean damage | Mean spins |
|---|---:|---:|---:|---:|
| invisibility | 808 | 67.2% | 921.0 | 16.8 |
| arcane | 2371 | 60.7% | 890.5 | 14.3 |
| regeneration | 992 | 59.0% | 983.0 | 17.6 |
| haste | 2288 | 60.7% | 879.8 | 16.6 |
| double-damage | 772 | 64.2% | 899.3 | 14.1 |
| illusion | 2308 | 58.9% | 874.4 | 14.8 |
| shield | 770 | 65.1% | 917.6 | 16.9 |

## defensive

End-stage distribution: 1: 1563, 2: 1721, 3: 2534, 4: 2541, 5: 1339, 6: 244, 7: 53, 8: 5. Censored: 0.

| Reward | Offered | Selected | Selection when offered |
|---|---:|---:|---:|
| blade-mastery | 3029 | 26 | 0.9% |
| critical-power | 2979 | 34 | 1.1% |
| arcane-knowledge | 3041 | 42 | 1.4% |
| fortified-armor | 5842 | 4069 | 69.7% |
| extra-charges | 2999 | 1355 | 45.2% |
| vitality | 5750 | 4629 | 80.5% |
| battle-recovery | 5535 | 4481 | 81.0% |
| artifact-mastery | 3036 | 584 | 19.2% |
| roshan-hunter | 3102 | 3 | 0.1% |
| second-wind | 1111 | 846 | 76.1% |
| double-damage | 1042 | 273 | 26.2% |
| regeneration | 5781 | 1251 | 21.6% |
| haste | 3016 | 876 | 29.0% |
| arcane | 3048 | 972 | 31.9% |
| invisibility | 5803 | 462 | 8.0% |
| shield | 5810 | 484 | 8.3% |
| illusion | 3099 | 954 | 30.8% |

| Rune | Stages | Clear rate | Mean damage | Mean spins |
|---|---:|---:|---:|---:|
| arcane | 972 | 65.3% | 918.3 | 14.9 |
| illusion | 954 | 62.6% | 917.9 | 15.8 |
| regeneration | 1251 | 49.6% | 1002.1 | 18.5 |
| haste | 876 | 65.0% | 905.5 | 17.0 |
| shield | 484 | 61.2% | 924.5 | 17.3 |
| invisibility | 462 | 61.7% | 917.5 | 17.0 |
| double-damage | 273 | 67.8% | 932.3 | 14.6 |

## balanced

End-stage distribution: 1: 1480, 2: 1623, 3: 2531, 4: 2797, 5: 1329, 6: 208, 7: 29, 8: 2, 9: 1. Censored: 0.

| Reward | Offered | Selected | Selection when offered |
|---|---:|---:|---:|
| blade-mastery | 3092 | 789 | 25.5% |
| critical-power | 3099 | 823 | 26.6% |
| arcane-knowledge | 3064 | 857 | 28.0% |
| fortified-armor | 5885 | 1403 | 23.8% |
| extra-charges | 3158 | 2662 | 84.3% |
| vitality | 5822 | 2817 | 48.4% |
| battle-recovery | 5762 | 2683 | 46.6% |
| artifact-mastery | 3011 | 840 | 27.9% |
| roshan-hunter | 3150 | 100 | 3.2% |
| second-wind | 1085 | 549 | 50.6% |
| double-damage | 1117 | 724 | 64.8% |
| regeneration | 5879 | 1159 | 19.7% |
| haste | 3142 | 2014 | 64.1% |
| arcane | 3080 | 2075 | 67.4% |
| invisibility | 5708 | 58 | 1.0% |
| shield | 5782 | 54 | 0.9% |
| illusion | 3048 | 2021 | 66.3% |

| Rune | Stages | Clear rate | Mean damage | Mean spins |
|---|---:|---:|---:|---:|
| haste | 2014 | 69.2% | 909.1 | 17.1 |
| illusion | 2021 | 64.8% | 900.9 | 15.6 |
| double-damage | 724 | 69.1% | 929.2 | 14.4 |
| arcane | 2075 | 67.3% | 912.6 | 15.1 |
| regeneration | 1159 | 47.4% | 998.5 | 18.2 |
| invisibility | 58 | 72.4% | 939.9 | 16.4 |
| shield | 54 | 61.1% | 906.0 | 17.9 |
