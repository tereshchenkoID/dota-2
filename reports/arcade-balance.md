# Arcade progression simulation

10000 runs per strategy. Seed 20261016. Combat and modifier streams paired by run and stage across strategies.

| Strategy | Mean | Median | Stage 5 | Stage 10 | Stage 15 | Upgrades | Damage | Duration* | HP loss | Spins loss |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| random | 5.51 | 5 | 64.7% | 8.6% | 0.3% | 3.12 | 4188 | 147 s | 42.5% | 57.5% |
| damage | 5.23 | 5 | 66.0% | 4.0% | 0.0% | 2.93 | 3767 | 126 s | 66.2% | 33.8% |
| defense | 5.40 | 5 | 62.1% | 8.5% | 0.1% | 3.86 | 4116 | 152 s | 12.8% | 87.2% |
| utility | 5.12 | 5 | 64.4% | 3.3% | 0.0% | 1.92 | 3703 | 136 s | 55.8% | 44.2% |
| balanced | 5.72 | 5 | 65.5% | 12.1% | 1.0% | 4.58 | 4476 | 156 s | 44.6% | 55.4% |
| adaptive | 6.05 | 6 | 66.4% | 15.7% | 1.7% | 4.67 | 4874 | 164 s | 42.1% | 57.9% |

*Duration estimates animation plus 8 seconds per choice; it is not measured human play time. Rune clear rates are observational, not causal. Stage 500 is a simulation guard only; censored runs are reported separately.

## random

Empty spins: 56.1%. Max stage: 18. Censored: 0.

Distribution: {"1":789,"2":759,"3":874,"4":1110,"5":1779,"6":1464,"7":1046,"8":759,"9":565,"10":363,"11":221,"12":146,"13":66,"14":28,"15":22,"16":6,"17":2,"18":1}

| Reward | Offered | Chosen | Pick rate |
|---|---:|---:|---:|
| blade-mastery | 9535 | 3164 | 33.2% |
| critical-power | 6020 | 1965 | 32.6% |
| arcane-knowledge | 5988 | 1983 | 33.1% |
| fortified-armor | 15155 | 5044 | 33.3% |
| extra-charges | 9790 | 3145 | 32.1% |
| vitality | 14839 | 5022 | 33.8% |
| battle-recovery | 14795 | 4948 | 33.4% |
| artifact-mastery | 9863 | 3317 | 33.6% |
| roshan-hunter | 6251 | 2116 | 33.9% |
| second-wind | 1533 | 502 | 32.7% |
| double-damage | 1432 | 464 | 32.4% |
| regeneration | 8815 | 2927 | 33.2% |
| haste | 4499 | 1504 | 33.4% |
| arcane | 4456 | 1528 | 34.3% |
| invisibility | 8852 | 3043 | 34.4% |
| shield | 8953 | 2941 | 32.8% |
| illusion | 4428 | 1455 | 32.9% |

| Rune | Stages | Clear rate | Mean damage |
|---|---:|---:|---:|
| invisibility | 3043 | 80.6% | 802 |
| shield | 2941 | 83.5% | 807 |
| regeneration | 2927 | 84.9% | 812 |
| arcane | 1528 | 85.4% | 798 |
| illusion | 1455 | 82.2% | 796 |
| haste | 1504 | 83.7% | 793 |
| double-damage | 464 | 84.3% | 803 |

## damage

Empty spins: 56.0%. Max stage: 15. Censored: 0.

Distribution: {"1":789,"2":677,"3":747,"4":1188,"5":2131,"6":1710,"7":1236,"8":746,"9":381,"10":220,"11":112,"12":46,"13":10,"14":6,"15":1}

| Reward | Offered | Chosen | Pick rate |
|---|---:|---:|---:|
| blade-mastery | 9067 | 8686 | 95.8% |
| critical-power | 5855 | 5593 | 95.5% |
| arcane-knowledge | 5857 | 5612 | 95.8% |
| fortified-armor | 13703 | 0 | 0.0% |
| extra-charges | 9297 | 2379 | 25.6% |
| vitality | 13583 | 0 | 0.0% |
| battle-recovery | 13694 | 0 | 0.0% |
| artifact-mastery | 9144 | 2234 | 24.4% |
| roshan-hunter | 6281 | 4758 | 75.8% |
| second-wind | 1395 | 0 | 0.0% |
| double-damage | 1367 | 735 | 53.8% |
| regeneration | 8362 | 2170 | 26.0% |
| haste | 4336 | 1100 | 25.4% |
| arcane | 4216 | 2371 | 56.2% |
| invisibility | 8420 | 2165 | 25.7% |
| shield | 8256 | 2194 | 26.6% |
| illusion | 4106 | 2316 | 56.4% |

| Rune | Stages | Clear rate | Mean damage |
|---|---:|---:|---:|
| shield | 2194 | 85.1% | 778 |
| arcane | 2371 | 84.3% | 751 |
| illusion | 2316 | 79.2% | 736 |
| regeneration | 2170 | 87.9% | 788 |
| double-damage | 735 | 83.4% | 768 |
| invisibility | 2165 | 84.0% | 786 |
| haste | 1100 | 78.3% | 732 |

## defense

Empty spins: 56.0%. Max stage: 17. Censored: 0.

Distribution: {"1":789,"2":862,"3":1017,"4":1122,"5":1687,"6":1336,"7":983,"8":782,"9":575,"10":423,"11":241,"12":120,"13":39,"14":18,"15":4,"16":1,"17":1}

| Reward | Offered | Chosen | Pick rate |
|---|---:|---:|---:|
| blade-mastery | 9332 | 0 | 0.0% |
| critical-power | 5938 | 0 | 0.0% |
| arcane-knowledge | 5837 | 0 | 0.0% |
| fortified-armor | 14939 | 12428 | 83.2% |
| extra-charges | 9493 | 483 | 5.1% |
| vitality | 14291 | 11878 | 83.1% |
| battle-recovery | 14367 | 12002 | 83.5% |
| artifact-mastery | 9701 | 491 | 5.1% |
| roshan-hunter | 5871 | 0 | 0.0% |
| second-wind | 1651 | 1278 | 77.4% |
| double-damage | 1351 | 106 | 7.8% |
| regeneration | 8750 | 1398 | 16.0% |
| haste | 4409 | 270 | 6.1% |
| arcane | 4296 | 297 | 6.9% |
| invisibility | 8555 | 1467 | 17.1% |
| shield | 8797 | 1551 | 17.6% |
| illusion | 4386 | 339 | 7.7% |

| Rune | Stages | Clear rate | Mean damage |
|---|---:|---:|---:|
| invisibility | 1467 | 77.6% | 807 |
| shield | 1551 | 78.8% | 824 |
| regeneration | 1398 | 78.9% | 814 |
| illusion | 339 | 83.2% | 808 |
| haste | 270 | 88.5% | 858 |
| arcane | 297 | 85.5% | 834 |
| double-damage | 106 | 88.7% | 840 |

## utility

Empty spins: 56.0%. Max stage: 14. Censored: 0.

Distribution: {"1":789,"2":693,"3":825,"4":1249,"5":2243,"6":1649,"7":1123,"8":700,"9":402,"10":229,"11":70,"12":22,"13":5,"14":1}

| Reward | Offered | Chosen | Pick rate |
|---|---:|---:|---:|
| blade-mastery | 8721 | 306 | 3.5% |
| critical-power | 5602 | 222 | 4.0% |
| arcane-knowledge | 5532 | 214 | 3.9% |
| fortified-armor | 13411 | 444 | 3.3% |
| extra-charges | 9172 | 8523 | 92.9% |
| vitality | 13429 | 420 | 3.1% |
| battle-recovery | 13051 | 443 | 3.4% |
| artifact-mastery | 9220 | 8537 | 92.6% |
| roshan-hunter | 5575 | 31 | 0.6% |
| second-wind | 1360 | 59 | 4.3% |
| double-damage | 1366 | 723 | 52.9% |
| regeneration | 8234 | 4455 | 54.1% |
| haste | 4264 | 3493 | 81.9% |
| arcane | 4158 | 2174 | 52.3% |
| invisibility | 8161 | 4445 | 54.5% |
| shield | 8319 | 4505 | 54.2% |
| illusion | 4136 | 2243 | 54.2% |

| Rune | Stages | Clear rate | Mean damage |
|---|---:|---:|---:|
| shield | 4505 | 81.3% | 772 |
| illusion | 2243 | 79.9% | 746 |
| haste | 3493 | 77.9% | 731 |
| double-damage | 723 | 81.2% | 751 |
| regeneration | 4455 | 84.1% | 780 |
| arcane | 2174 | 81.0% | 754 |
| invisibility | 4445 | 80.6% | 774 |

## balanced

Empty spins: 56.0%. Max stage: 21. Censored: 0.

Distribution: {"1":789,"2":743,"3":819,"4":1094,"5":1836,"6":1326,"7":959,"8":697,"9":527,"10":448,"11":288,"12":197,"13":115,"14":66,"15":53,"16":18,"17":16,"18":8,"21":1}

| Reward | Offered | Chosen | Pick rate |
|---|---:|---:|---:|
| blade-mastery | 9933 | 3738 | 37.6% |
| critical-power | 6231 | 2421 | 38.9% |
| arcane-knowledge | 6181 | 2299 | 37.2% |
| fortified-armor | 16350 | 5351 | 32.7% |
| extra-charges | 10253 | 8282 | 80.8% |
| vitality | 15604 | 9013 | 57.8% |
| battle-recovery | 15661 | 9172 | 58.6% |
| artifact-mastery | 10449 | 4056 | 38.8% |
| roshan-hunter | 6491 | 431 | 6.6% |
| second-wind | 1591 | 987 | 62.0% |
| double-damage | 1527 | 15 | 1.0% |
| regeneration | 9248 | 1331 | 14.4% |
| haste | 4636 | 16 | 0.3% |
| arcane | 4528 | 25 | 0.6% |
| invisibility | 9198 | 38 | 0.4% |
| shield | 9230 | 28 | 0.3% |
| illusion | 4570 | 24 | 0.5% |

| Rune | Stages | Clear rate | Mean damage |
|---|---:|---:|---:|
| regeneration | 1331 | 84.0% | 915 |
| illusion | 24 | 87.5% | 765 |
| arcane | 25 | 84.0% | 763 |
| double-damage | 15 | 93.3% | 829 |
| invisibility | 38 | 84.2% | 811 |
| haste | 16 | 87.5% | 780 |
| shield | 28 | 92.9% | 791 |

## adaptive

Empty spins: 56.0%. Max stage: 22. Censored: 0.

Distribution: {"1":789,"2":718,"3":823,"4":1028,"5":1597,"6":1219,"7":913,"8":728,"9":611,"10":474,"11":386,"12":269,"13":162,"14":110,"15":73,"16":48,"17":26,"18":16,"19":6,"20":3,"22":1}

| Reward | Offered | Chosen | Pick rate |
|---|---:|---:|---:|
| blade-mastery | 10669 | 5188 | 48.6% |
| critical-power | 6765 | 2890 | 42.7% |
| arcane-knowledge | 6730 | 3381 | 50.2% |
| fortified-armor | 17244 | 6470 | 37.5% |
| extra-charges | 10931 | 6501 | 59.5% |
| vitality | 16577 | 6460 | 39.0% |
| battle-recovery | 16596 | 10527 | 63.4% |
| artifact-mastery | 11101 | 2800 | 25.2% |
| roshan-hunter | 7084 | 1745 | 24.6% |
| second-wind | 1749 | 750 | 42.9% |
| double-damage | 1640 | 116 | 7.1% |
| regeneration | 9925 | 2189 | 22.1% |
| haste | 4924 | 743 | 15.1% |
| arcane | 4867 | 15 | 0.3% |
| invisibility | 9781 | 18 | 0.2% |
| shield | 9880 | 660 | 6.7% |
| illusion | 4941 | 15 | 0.3% |

| Rune | Stages | Clear rate | Mean damage |
|---|---:|---:|---:|
| regeneration | 2189 | 82.6% | 941 |
| shield | 660 | 81.2% | 959 |
| haste | 743 | 85.9% | 911 |
| double-damage | 116 | 88.8% | 958 |
| arcane | 15 | 80.0% | 1031 |
| invisibility | 18 | 94.4% | 841 |
| illusion | 15 | 86.7% | 855 |
