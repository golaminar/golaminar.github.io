const arrivalTimes = [
    15.671819823610324,
    2.3425079923604413,
    136.8233259316847,
    52.0901796008311,
    5.529448663872993,
    78.48246343368574,
    268.26156122514095,
    164.7431285967978,
    399.54545382880684,
    4.3099691221961365,
    130.39060134844377,
    52.57467795451221,
    83.60072716656515,
    38.0675082942847,
    104.22471345089619,
    181.5805540824171,
    246.30302039497286,
    182.64296061544283,
    142.3135108088804,
    18.566986571816756,
    86.38936126278419,
    28.15529187702062,
    61.62329796706181,
    11.007361885298732,
    87.2194929850433,
    69.39159873366508,
    274.5316267937745,
    33.37759491543583,
    12.544891203350474,
    263.7976518107162,
    228.94350617431172,
    136.7839739105326,
    88.25194006991659,
    249.6169895505001,
    141.43580480222033,
    242.77808080973983,
    61.62020394321744,
    6.3279390702298794,
    140.31089831622467,
    11.26475330400854,
    137.9594703795387,
    95.08443306415542,
    160.15171879117008,
    108.37823959258725,
    87.2025016294638,
    245.57939577647304,
    297.15350345680594,
    216.56939929893085,
    26.132800950251333,
    174.76333785976587,
    14.624098279914172,
    48.4224506672587,
    300.49783693857864,
    69.83074165542222,
    20.834483874140997,
    110.9113077832886,
    52.373866334395245,
    13.45164624401135,
    46.96723913355259,
    158.02505873564655,
    329.9404606365886,
    112.22218775237302,
    194.34488956791836,
    179.9708626270397,
    250.14412170877216,
    108.5622255343799,
    20.61449102078704,
    165.5385830333422,
    276.7479860185028,
    314.9316008486108,
    58.35033279338807,
    49.4881341435965,
    15.395239332682625,
    580.4814386772235,
    105.03975709171208,
    233.8561457117,
    304.01852912829736,
    32.28121726305362,
    41.50757819742341,
    11.015385537052948,
    206.29971097067144,
    233.70976302151266,
    217.53075177451134,
    256.34101041994376,
    33.91355667481437,
    35.80211634975476,
    79.64126807558497,
    132.03580563796214,
    6.8771829473242745,
    81.41881777205282,
    67.56375895430689,
    176.3399138186052,
    350.3712414392074,
    122.82158881937723,
    525.056045459655,
    211.3800143379417,
    40.70697766273417,
    27.358591346601685,
];

const serviceTimes = [
    128.16490911554462,
    155.60701586404005,
    136.43804957283217,
    347.3865595741044,
    253.78771696357626,
    2.1650086105880715,
    186.12355203423792,
    840.0552046536693,
    66.0154021893165,
    158.75902518147035,
    90.83554319164043,
    51.25171803044677,
    62.88989279876296,
    86.39807048608544,
    101.94976104120333,
    31.579357987841497,
    20.304541817530023,
    133.06913225489063,
    61.438554729036426,
    16.707450660800408,
    4.360280006633678,
    6.925294278065679,
    102.07363209080289,
    52.74496801938395,
    115.799476598969,
    206.4719310122618,
    204.62825507709533,
    11.817223162743248,
    37.98983648066872,
    125.85388853948157,
    87.61714046208968,
    57.91448050898022,
    346.56265263403907,
    146.80469540387847,
    650.1394196499712,
    397.90731162905206,
    106.5096144847478,
    306.6500964630611,
    70.92959292335902,
    40.020955983758114,
    122.48285295087365,
    56.50574630585471,
    19.969301209146025,
    47.74084460857674,
    159.96163106779554,
    8.847340347574685,
    138.0843473531234,
    226.34709112901487,
    101.57542629353978,
    33.96679040659571,
    9.253511453090114,
    122.30626089587331,
    62.20171469399232,
    172.73915895935667,
    18.14540234052713,
    219.3213789612745,
    1.9662490999843125,
    49.86893141968982,
    113.83217519147708,
    88.35363822498371,
    213.69121594992862,
    34.085092723774586,
    6.675169967843356,
    8.217718123970355,
    8.869818631180216,
    190.29429920329954,
    120.23951711753564,
    2.474239006711607,
    166.59941083219994,
    41.569068740030744,
    72.25479180141933,
    15.534259196793682,
    81.99804442242313,
    97.37033645438952,
    366.132390480548,
    5.486699287714371,
    0.6884450270489726,
    61.20771210566066,
    173.87283841478188,
    16.521577964284333,
    360.0918827416572,
    31.73734967428747,
    271.91359583474355,
    11.055570745913698,
    221.28210833347308,
    48.60550598936411,
    147.19580829266823,
    24.317271614838454,
    5.864335052961403,
    127.53849659393654,
    72.86254317225058,
    41.40951985704925,
    72.79230118880415,
    5.921873210121654,
    164.07039641572078,
    345.1373910192141,
    46.62753636707885,
    83.48744406760038,
];

const expectedServiceBehaviour = [
    {
        serviceTime: 128.16490911554462,
        readyAt: 0,
        endsAt: 143.83672893915494,
        queueSizeWhenReady: 0,
        waitTime: 0
    },
    {
        serviceTime: 155.60701586404005,
        readyAt: 143.83672893915494,
        endsAt: 299.443744803195,
        queueSizeWhenReady: 1,
        waitTime: 125.82240112318416
    },
    {
        serviceTime: 136.43804957283217,
        readyAt: 299.443744803195,
        endsAt: 435.8817943760272,
        queueSizeWhenReady: 4,
        waitTime: 144.6060910555395
    },
    {
        serviceTime: 347.3865595741044,
        readyAt: 435.8817943760272,
        endsAt: 783.2683539501315,
        queueSizeWhenReady: 3,
        waitTime: 228.9539610275406
    },
    {
        serviceTime: 253.78771696357626,
        readyAt: 783.2683539501315,
        endsAt: 1037.0560709137078,
        queueSizeWhenReady: 4,
        waitTime: 570.811071937772
    },
    {
        serviceTime: 2.1650086105880715,
        readyAt: 1037.0560709137078,
        endsAt: 1039.2210795242959,
        queueSizeWhenReady: 3,
        waitTime: 746.1163254676625
    },
    {
        serviceTime: 186.12355203423792,
        readyAt: 1039.2210795242959,
        endsAt: 1225.3446315585338,
        queueSizeWhenReady: 2,
        waitTime: 480.01977285310954
    },
    {
        serviceTime: 840.0552046536693,
        readyAt: 1225.3446315585338,
        endsAt: 2065.399836212203,
        queueSizeWhenReady: 3,
        waitTime: 501.40019629054973
    },
    {
        serviceTime: 66.0154021893165,
        readyAt: 2065.399836212203,
        endsAt: 2131.415238401519,
        queueSizeWhenReady: 9,
        waitTime: 941.909947115412
    },
    {
        serviceTime: 158.75902518147035,
        readyAt: 2131.415238401519,
        endsAt: 2290.1742635829896,
        queueSizeWhenReady: 8,
        waitTime: 1003.6153801825321
    },
    {
        serviceTime: 90.83554319164043,
        readyAt: 2290.1742635829896,
        endsAt: 2381.00980677463,
        queueSizeWhenReady: 9,
        waitTime: 1031.9838040155587
    },
    {
        serviceTime: 51.25171803044677,
        readyAt: 2381.00980677463,
        endsAt: 2432.2615248050765,
        queueSizeWhenReady: 9,
        waitTime: 1070.2446692526867
    },
    {
        serviceTime: 62.88989279876296,
        readyAt: 2432.2615248050765,
        endsAt: 2495.1514176038395,
        queueSizeWhenReady: 10,
        waitTime: 1037.8956601165683
    },
    {
        serviceTime: 86.39807048608544,
        readyAt: 2495.1514176038395,
        endsAt: 2581.549488089925,
        queueSizeWhenReady: 10,
        waitTime: 1062.7180446210466
    },
    {
        serviceTime: 101.94976104120333,
        readyAt: 2581.549488089925,
        endsAt: 2683.499249131128,
        queueSizeWhenReady: 10,
        waitTime: 1044.891401656236
    },
    {
        serviceTime: 31.579357987841497,
        readyAt: 2683.499249131128,
        endsAt: 2715.0786071189696,
        queueSizeWhenReady: 11,
        waitTime: 965.260608615022
    },
    {
        serviceTime: 20.304541817530023,
        readyAt: 2715.0786071189696,
        endsAt: 2735.3831489364998,
        queueSizeWhenReady: 10,
        waitTime: 750.5369462078904
    },
    {
        serviceTime: 133.06913225489063,
        readyAt: 2735.3831489364998,
        endsAt: 2868.4522811913903,
        queueSizeWhenReady: 9,
        waitTime: 588.1985274099779
    },
    {
        serviceTime: 61.438554729036426,
        readyAt: 2868.4522811913903,
        endsAt: 2929.8908359204265,
        queueSizeWhenReady: 8,
        waitTime: 578.954148855988
    },
    {
        serviceTime: 16.707450660800408,
        readyAt: 2929.8908359204265,
        endsAt: 2946.598286581227,
        queueSizeWhenReady: 8,
        waitTime: 621.8257170132074
    },
    {
        serviceTime: 4.360280006633678,
        readyAt: 2946.598286581227,
        endsAt: 2950.958566587861,
        queueSizeWhenReady: 7,
        waitTime: 552.1438064112235
    },
    {
        serviceTime: 6.925294278065679,
        readyAt: 2950.958566587861,
        endsAt: 2957.8838608659266,
        queueSizeWhenReady: 6,
        waitTime: 528.3487945408365
    },
    {
        serviceTime: 102.07363209080289,
        readyAt: 2957.8838608659266,
        endsAt: 3059.9574929567293,
        queueSizeWhenReady: 5,
        waitTime: 473.6507908518406
    },
    {
        serviceTime: 52.74496801938395,
        readyAt: 3059.9574929567293,
        endsAt: 3112.7024609761133,
        queueSizeWhenReady: 6,
        waitTime: 564.7170610573444
    },
    {
        serviceTime: 115.799476598969,
        readyAt: 3112.7024609761133,
        endsAt: 3228.501937575082,
        queueSizeWhenReady: 5,
        waitTime: 530.242536091685
    },
    {
        serviceTime: 206.4719310122618,
        readyAt: 3228.501937575082,
        endsAt: 3434.973868587344,
        queueSizeWhenReady: 4,
        waitTime: 576.6504139569888
    },
    {
        serviceTime: 204.62825507709533,
        readyAt: 3434.973868587344,
        endsAt: 3639.602123664439,
        queueSizeWhenReady: 4,
        waitTime: 508.590718175476
    },
    {
        serviceTime: 11.817223162743248,
        readyAt: 3639.602123664439,
        endsAt: 3651.4193468271824,
        queueSizeWhenReady: 5,
        waitTime: 679.8413783371352
    },
    {
        serviceTime: 37.98983648066872,
        readyAt: 3651.4193468271824,
        endsAt: 3689.409183307851,
        queueSizeWhenReady: 4,
        waitTime: 679.1137102965281
    },
    {
        serviceTime: 125.85388853948157,
        readyAt: 3689.409183307851,
        endsAt: 3815.2630718473324,
        queueSizeWhenReady: 3,
        waitTime: 453.30589496648054
    },
    {
        serviceTime: 87.61714046208968,
        readyAt: 3815.2630718473324,
        endsAt: 3902.880212309422,
        queueSizeWhenReady: 3,
        waitTime: 350.2162773316504
    },
    {
        serviceTime: 57.91448050898022,
        readyAt: 3902.880212309422,
        endsAt: 3960.7946928184024,
        queueSizeWhenReady: 2,
        waitTime: 301.04944388320746
    },
    {
        serviceTime: 346.56265263403907,
        readyAt: 3960.7946928184024,
        endsAt: 4307.357345452441,
        queueSizeWhenReady: 2,
        waitTime: 270.7119843222713
    },
    {
        serviceTime: 146.80469540387847,
        readyAt: 4307.357345452441,
        endsAt: 4454.162040856319,
        queueSizeWhenReady: 2,
        waitTime: 367.65764740581017
    },
    {
        serviceTime: 650.1394196499712,
        readyAt: 4454.162040856319,
        endsAt: 5104.301460506291,
        queueSizeWhenReady: 4,
        waitTime: 373.02653800746793
    },
    {
        serviceTime: 397.90731162905206,
        readyAt: 5104.301460506291,
        endsAt: 5502.208772135343,
        queueSizeWhenReady: 9,
        waitTime: 780.3878768476998
    },
    {
        serviceTime: 106.5096144847478,
        readyAt: 5502.208772135343,
        endsAt: 5608.71838662009,
        queueSizeWhenReady: 10,
        waitTime: 1116.6749845335344
    },
    {
        serviceTime: 306.6500964630611,
        readyAt: 5608.71838662009,
        endsAt: 5915.368483083152,
        queueSizeWhenReady: 9,
        waitTime: 1216.8566599480519
    },
    {
        serviceTime: 70.92959292335902,
        readyAt: 5915.368483083152,
        endsAt: 5986.298076006511,
        queueSizeWhenReady: 10,
        waitTime: 1383.1958580948885
    },
    {
        serviceTime: 40.020955983758114,
        readyAt: 5986.298076006511,
        endsAt: 6026.31903199027,
        queueSizeWhenReady: 10,
        waitTime: 1442.860697714239
    },
    {
        serviceTime: 122.48285295087365,
        readyAt: 6026.31903199027,
        endsAt: 6148.801884941144,
        queueSizeWhenReady: 9,
        waitTime: 1344.9221833184592
    },
    {
        serviceTime: 56.50574630585471,
        readyAt: 6148.801884941144,
        endsAt: 6205.307631246998,
        queueSizeWhenReady: 10,
        waitTime: 1372.3206032051776
    },
    {
        serviceTime: 19.969301209146025,
        readyAt: 6205.307631246998,
        endsAt: 6225.276932456144,
        queueSizeWhenReady: 10,
        waitTime: 1268.6746307198619
    },
    {
        serviceTime: 47.74084460857674,
        readyAt: 6225.276932456144,
        endsAt: 6273.017777064721,
        queueSizeWhenReady: 9,
        waitTime: 1180.2656923364202
    },
    {
        serviceTime: 159.96163106779554,
        readyAt: 6273.017777064721,
        endsAt: 6432.979408132516,
        queueSizeWhenReady: 8,
        waitTime: 1140.804035315533
    },
    {
        serviceTime: 8.847340347574685,
        readyAt: 6432.979408132516,
        endsAt: 6441.826748480091,
        queueSizeWhenReady: 7,
        waitTime: 1055.186270606856
    },
    {
        serviceTime: 138.0843473531234,
        readyAt: 6441.826748480091,
        endsAt: 6579.911095833214,
        queueSizeWhenReady: 6,
        waitTime: 766.8801074976245
    },
    {
        serviceTime: 226.34709112901487,
        readyAt: 6579.911095833214,
        endsAt: 6806.258186962229,
        queueSizeWhenReady: 8,
        waitTime: 688.3950555518168
    },
    {
        serviceTime: 101.57542629353978,
        readyAt: 6806.258186962229,
        endsAt: 6907.833613255769,
        queueSizeWhenReady: 11,
        waitTime: 888.6093457305806
    },
    {
        serviceTime: 33.96679040659571,
        readyAt: 6907.833613255769,
        endsAt: 6941.800403662364,
        queueSizeWhenReady: 10,
        waitTime: 815.4214341643547
    },
    {
        serviceTime: 9.253511453090114,
        readyAt: 6941.800403662364,
        endsAt: 6951.053915115454,
        queueSizeWhenReady: 10,
        waitTime: 834.7641262910356
    },
    {
        serviceTime: 122.30626089587331,
        readyAt: 6951.053915115454,
        endsAt: 7073.360176011328,
        queueSizeWhenReady: 9,
        waitTime: 795.5951870768668
    },
    {
        serviceTime: 62.20171469399232,
        readyAt: 7073.360176011328,
        endsAt: 7135.56189070532,
        queueSizeWhenReady: 8,
        waitTime: 617.4036110341613
    },
    {
        serviceTime: 172.73915895935667,
        readyAt: 7135.56189070532,
        endsAt: 7308.301049664677,
        queueSizeWhenReady: 7,
        waitTime: 609.7745840727312
    },
    {
        serviceTime: 18.14540234052713,
        readyAt: 7308.301049664677,
        endsAt: 7326.446452005203,
        queueSizeWhenReady: 7,
        waitTime: 761.679259157946
    },
    {
        serviceTime: 219.3213789612745,
        readyAt: 7326.446452005203,
        endsAt: 7545.767830966478,
        queueSizeWhenReady: 6,
        waitTime: 668.9133537151838
    },
    {
        serviceTime: 1.9662490999843125,
        readyAt: 7545.767830966478,
        endsAt: 7547.734080066462,
        queueSizeWhenReady: 6,
        waitTime: 835.8608663420628
    },
    {
        serviceTime: 49.86893141968982,
        readyAt: 7547.734080066462,
        endsAt: 7597.603011486152,
        queueSizeWhenReady: 5,
        waitTime: 824.3754691980357
    },
    {
        serviceTime: 113.83217519147708,
        readyAt: 7597.603011486152,
        endsAt: 7711.43518667763,
        queueSizeWhenReady: 5,
        waitTime: 827.2771614841731
    },
    {
        serviceTime: 88.35363822498371,
        readyAt: 7711.43518667763,
        endsAt: 7799.788824902614,
        queueSizeWhenReady: 4,
        waitTime: 783.0842779400036
    },
    {
        serviceTime: 213.69121594992862,
        readyAt: 7799.788824902614,
        endsAt: 8013.4800408525425,
        queueSizeWhenReady: 4,
        waitTime: 541.4974555283989
    },
    {
        serviceTime: 34.085092723774586,
        readyAt: 8013.4800408525425,
        endsAt: 8047.565133576317,
        queueSizeWhenReady: 4,
        waitTime: 642.9664837259543
    },
    {
        serviceTime: 6.675169967843356,
        readyAt: 8047.565133576317,
        endsAt: 8054.24030354416,
        queueSizeWhenReady: 3,
        waitTime: 482.7066868818101
    },
    {
        serviceTime: 8.217718123970355,
        readyAt: 8054.24030354416,
        endsAt: 8062.458021668131,
        queueSizeWhenReady: 2,
        waitTime: 309.41099422261414
    },
    {
        serviceTime: 8.869818631180216,
        readyAt: 8062.458021668131,
        endsAt: 8071.327840299311,
        queueSizeWhenReady: 1,
        waitTime: 67.48459063781229
    },
    {
        serviceTime: 190.29429920329954,
        readyAt: 8071.327840299311,
        endsAt: 8293.829955767998,
        queueSizeWhenReady: 0,
        waitTime: 0
    },
    {
        serviceTime: 120.23951711753564,
        readyAt: 8293.829955767998,
        endsAt: 8414.069472885534,
        queueSizeWhenReady: 2,
        waitTime: 169.67980818251363
    },
    {
        serviceTime: 2.474239006711607,
        readyAt: 8414.069472885534,
        endsAt: 8416.543711892245,
        queueSizeWhenReady: 1,
        waitTime: 124.38074226670687
    },
    {
        serviceTime: 166.59941083219994,
        readyAt: 8416.543711892245,
        endsAt: 8733.03612746953,
        queueSizeWhenReady: 0,
        waitTime: 0
    },
    {
        serviceTime: 41.569068740030744,
        readyAt: 8733.03612746953,
        endsAt: 8922.937386225973,
        queueSizeWhenReady: 0,
        waitTime: 0
    },
    {
        serviceTime: 72.25479180141933,
        readyAt: 8922.937386225973,
        endsAt: 9011.973442080749,
        queueSizeWhenReady: 0,
        waitTime: 0
    },
    {
        serviceTime: 15.534259196793682,
        readyAt: 9011.973442080749,
        endsAt: 9027.507701277542,
        queueSizeWhenReady: 2,
        waitTime: 22.76665765782309
    },
    {
        serviceTime: 81.99804442242313,
        readyAt: 9027.507701277542,
        endsAt: 9109.505745699966,
        queueSizeWhenReady: 1,
        waitTime: 22.905677521934194
    },
    {
        serviceTime: 97.37033645438952,
        readyAt: 9109.505745699966,
        endsAt: 9682.45379888722,
        queueSizeWhenReady: 0,
        waitTime: 0
    },
    {
        serviceTime: 366.132390480548,
        readyAt: 9682.45379888722,
        endsAt: 10056.255610005092,
        queueSizeWhenReady: 0,
        waitTime: 0
    },
    {
        serviceTime: 5.486699287714371,
        readyAt: 10056.255610005092,
        endsAt: 10061.742309292806,
        queueSizeWhenReady: 1,
        waitTime: 132.2762447688492
    },
    {
        serviceTime: 0.6884450270489726,
        readyAt: 10061.742309292806,
        endsAt: 10228.686339391588,
        queueSizeWhenReady: 0,
        waitTime: 0
    },
    {
        serviceTime: 61.20771210566066,
        readyAt: 10228.686339391588,
        endsAt: 10321.486823733254,
        queueSizeWhenReady: 0,
        waitTime: 0
    },
    {
        serviceTime: 173.87283841478188,
        readyAt: 10321.486823733254,
        endsAt: 10495.359662148036,
        queueSizeWhenReady: 2,
        waitTime: 19.700133908238058
    },
    {
        serviceTime: 16.521577964284333,
        readyAt: 10495.359662148036,
        endsAt: 10511.88124011232,
        queueSizeWhenReady: 1,
        waitTime: 182.55758678596612
    },
    {
        serviceTime: 360.0918827416572,
        readyAt: 10511.88124011232,
        endsAt: 10879.193669074399,
        queueSizeWhenReady: 0,
        waitTime: 0
    },
    {
        serviceTime: 31.73734967428747,
        readyAt: 10879.193669074399,
        endsAt: 10910.931018748686,
        queueSizeWhenReady: 1,
        waitTime: 126.38211972014506
    },
    {
        serviceTime: 271.91359583474355,
        readyAt: 10910.931018748686,
        endsAt: 11242.255896963508,
        queueSizeWhenReady: 0,
        waitTime: 0
    },
    {
        serviceTime: 11.055570745913698,
        readyAt: 11242.255896963508,
        endsAt: 11253.311467709422,
        queueSizeWhenReady: 1,
        waitTime: 15.572585414800415
    },
    {
        serviceTime: 221.28210833347308,
        readyAt: 11253.311467709422,
        endsAt: 11481.878976556995,
        queueSizeWhenReady: 0,
        waitTime: 0
    },
    {
        serviceTime: 48.60550598936411,
        readyAt: 11481.878976556995,
        endsAt: 11530.484482546359,
        queueSizeWhenReady: 2,
        waitTime: 185.47999198371872
    },
    {
        serviceTime: 147.19580829266823,
        readyAt: 11530.484482546359,
        endsAt: 11677.680290839027,
        queueSizeWhenReady: 3,
        waitTime: 154.44422989749728
    },
    {
        serviceTime: 24.317271614838454,
        readyAt: 11677.680290839027,
        endsAt: 11701.997562453866,
        queueSizeWhenReady: 4,
        waitTime: 169.60423255220303
    },
    {
        serviceTime: 5.864335052961403,
        readyAt: 11701.997562453866,
        endsAt: 11707.861897506828,
        queueSizeWhenReady: 3,
        waitTime: 187.04432121971695
    },
    {
        serviceTime: 127.53849659393654,
        readyAt: 11707.861897506828,
        endsAt: 11835.400394100765,
        queueSizeWhenReady: 2,
        waitTime: 111.48983850062541
    },
    {
        serviceTime: 72.86254317225058,
        readyAt: 11835.400394100765,
        endsAt: 11908.262937273015,
        queueSizeWhenReady: 1,
        waitTime: 171.4645761402553
    },
    {
        serviceTime: 41.40951985704925,
        readyAt: 11908.262937273015,
        endsAt: 11949.672457130064,
        queueSizeWhenReady: 1,
        waitTime: 67.98720549390055
    },
    {
        serviceTime: 72.79230118880415,
        readyAt: 11949.672457130064,
        endsAt: 12263.439274407125,
        queueSizeWhenReady: 0,
        waitTime: 0
    },
    {
        serviceTime: 5.921873210121654,
        readyAt: 12263.439274407125,
        endsAt: 12319.39043524782,
        queueSizeWhenReady: 0,
        waitTime: 0
    },
    {
        serviceTime: 164.07039641572078,
        readyAt: 12319.39043524782,
        endsAt: 13002.595003913073,
        queueSizeWhenReady: 0,
        waitTime: 0
    },
    {
        serviceTime: 345.1373910192141,
        readyAt: 13002.595003913073,
        endsAt: 13395.042012854508,
        queueSizeWhenReady: 0,
        waitTime: 0
    },
    {
        serviceTime: 46.62753636707885,
        readyAt: 13395.042012854508,
        endsAt: 13441.669549221588,
        queueSizeWhenReady: 2,
        waitTime: 304.43041335648013
    },
    {
        serviceTime: 83.48744406760038,
        readyAt: 13441.669549221588,
        endsAt: 13525.156993289189,
        queueSizeWhenReady: 1,
        waitTime: 323.6993583769581
    }
]

module.exports = { arrivalTimes, serviceTimes, expectedServiceBehaviour };
