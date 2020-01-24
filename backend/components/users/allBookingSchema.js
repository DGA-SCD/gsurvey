// MIT License

// Copyright 2019-present, Digital Government Development Agency (Public Organization) 

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/**
 * Use for generate header of datable
 */
module.exports.allbooking = () => { return [
    { title: 'รหัส', field: 'userId', type: 'string',  editable: 'never'},
    { title: 'ชื่อ-สกุล', field: 'fullname', type: 'string',  editable: 'never'},
    { title: 'ฝ่าย', field: 'department', type: 'string',  editable: 'never'},
    { title: 'ส่วนงาน', field: 'segment', type: 'string',  editable: 'never'},
    { title: 'เพื่อนร่วมห้อง', field: 'friend', type: 'string',  editable: 'never'},
    { title: 'ห้อง', field: 'room', type: 'string', lookup: {
        2: "1101 Twin Bed (2)",
        3: "1102 Twin Bed (2)",
        4: "1103 Double Bed (2)",
        5: "1104 Twin Bed (2)",
        6: "1105 Double Bed (2)",
        7: "1106 Twin Bed (2)",
        8: "1107 Double Bed (2)",
        9: "1108 Double Bed (2)",
        10: "1109 Double Bed (2)",
        11: "1110 Double Bed (2)",
        12: "1112 Double Bed (2)",
        13: "1113 Double Bed (2)",
        14: "1114 Double Bed (2)",
        15: "1115 Double Bed (2)",
        16: "1116 Double Bed (2)",
        17: "1117 Double Bed (2)",
        18: "1118 Double Bed (2)",
        19: "1119 Double Bed (2)",
        20: "1120 Horizon Suite (2)",
        21: "1201 Family (2)",
        22: "1202 Twin Bed (2)",
        23: "1203 Double Bed (2)",
        24: "1204 Twin Bed (2)",
        25: "1205 Double Bed (2)",
        26: "1206 Twin Bed (2)",
        27: "1207 Double Bed (2)",
        28: "1208 Twin Bed (2)",
        29: "1209 Twin Bed (2)",
        30: "1210 Twin Bed (2)",
        31: "1211 Twin Bed (2)",
        32: "1212 Twin Bed (2)",
        33: "1213 Twin Bed (2)",
        34: "1214 Twin Bed (2)",
        35: "1215 Twin Bed (2)",
        36: "1216 Double Bed (2)",
        37: "1217 Double Bed (2)",
        38: "1218 Double Bed (2)",
        39: "1219 Double Bed (2)",
        40: "1220 Junior Suite (2)",
        41: "1301 Family (2)",
        42: "1302 Twin Bed (2)",
        43: "1303 Double Bed (2)",
        44: "1304 Twin Bed (2)",
        45: "1305 Double Bed (2)",
        46: "1306 Twin Bed (2)",
        47: "1307 Double Bed (2)",
        48: "1308 Twin Bed (2)",
        49: "1309 Twin Bed (2)",
        50: "1310 Twin Bed (2)",
        51: "1311 Twin Bed (2)",
        52: "1312 Twin Bed (2)",
        53: "1313 Twin Bed (2)",
        54: "1314 Twin Bed (2)",
        55: "1315 Twin Bed (2)",
        56: "1316 Double Bed (2)",
        57: "1317 Double Bed (2)",
        58: "1318 Double Bed (2)",
        59: "1319 Double Bed (2)",
        60: "1320 Junior Suite (2)",
        61: "1401 Family (2)",
        62: "1402 Twin Bed (2)",
        63: "1403 Double Bed (2)",
        64: "1404 Twin Bed (2)",
        65: "1405 Double Bed (2)",
        66: "1406 Twin Bed (2)",
        67: "1407 Twin Bed (2)",
        68: "1408 Twin Bed (2)",
        69: "1409 Twin Bed (2)",
        70: "1410 Twin Bed (2)",
        71: "1411 Double Bed (2)",
        72: "1412 Double Bed (2)",
        73: "1413 Double Bed (2)",
        74: "1414 Junior Suite (2)",
        75: "1501 Family (2)",
        76: "1502 Twin Bed (2)",
        77: "1503 Double Bed (2)",
        78: "1504 Double Bed (2)",
        79: "1505 Double Bed (2)",
        80: "1506 Double Bed (2)",
        81: "1507 Double Bed (2)",
        82: "1508 Junior Suite (2)",
        83: "2101 Twin Bed (2)",
        84: "2102 Twin Bed (2)",
        85: "2103 Double Bed (2)",
        86: "2104 Twin Bed (2)",
        87: "2105 Double Bed (2)",
        88: "2106 Twin Bed (2)",
        89: "2107 Double Bed (2)",
        90: "2108 Double Bed (2)",
        91: "2109 Double Bed (2)",
        92: "2110 Double Bed (2)",
        93: "2112 Double Bed (2)",
        94: "2113 Double Bed (2)",
        95: "2114 Double Bed (2)",
        96: "2115 Double Bed (2)",
        97: "2116 Double Bed (2)",
        98: "2117 Double Bed (2)",
        99: "2118 Double Bed (2)",
        100: "2119 Double Bed (2)",
        101: "2120 Lagoon Suite (2)",
        102: "2201 Family (2)",
        103: "2202 Twin Bed (2)",
        104: "2203 Double Bed (2)",
        105: "2204 Twin Bed (2)",
        106: "2205 Double Bed (2)",
        107: "2206 Twin Bed (2)",
        108: "2207 Double Bed (2)",
        109: "2208 Twin Bed (2)",
        110: "2209 Twin Bed (2)",
        111: "2210 Twin Bed (2)",
        112: "2211 Twin Bed (2)",
        113: "2212 Twin Bed (2)",
        114: "2213 Twin Bed (2)",
        115: "2214 Twin Bed (2)",
        116: "2215 Twin Bed (2)",
        117: "2216 Double Bed (2)",
        118: "2217 Double Bed (2)",
        119: "2218 Double Bed (2)",
        120: "2219 Double Bed (2)",
        121: "2220 Junior Suite (2)",
        122: "2301 Family (2)",
        123: "2302 Twin Bed (2)",
        124: "2303 Double Bed (2)",
        125: "2304 Twin Bed (2)",
        126: "2305 Double Bed (2)",
        127: "2306 Twin Bed (2)",
        128: "2307 Double Bed (2)",
        129: "2308 Twin Bed (2)",
        130: "2309 Twin Bed (2)",
        131: "2310 Twin Bed (2)",
        132: "2311 Twin Bed (2)",
        133: "2312 Twin Bed (2)",
        134: "2313 Twin Bed (2)",
        135: "2314 Twin Bed (2)",
        136: "2315 Twin Bed (2)",
        137: "2316 Double Bed (2)",
        138: "2317 Double Bed (2)",
        139: "2318 Double Bed (2)",
        140: "2319 Double Bed (2)",
        141: "2320 Junior Suite (2)",
        142: "2401 Family (2)",
        143: "2402 Twin Bed (2)",
        144: "2403 Double Bed (2)",
        145: "2404 Twin Bed (2)",
        146: "2405 Double Bed (2)",
        147: "2406 Twin Bed (2)",
        148: "2407 Twin Bed (2)",
        149: "2408 Twin Bed (2)",
        150: "2409 Twin Bed (2)",
        151: "2410 Twin Bed (2)",
        152: "2411 Double Bed (2)",
        153: "2412 Double Bed (2)",
        154: "2413 Double Bed (2)",
        155: "2414 Junior Suite (2)",
        156: "2501 Family (2)",
        157: "2502 Twin Bed (2)",
        158: "2503 Double Bed (2)",
        159: "2504 Double Bed (2)",
        160: "2505 Double Bed (2)",
        161: "2506 Double Bed (2)",
        162: "2507 Double Bed (2)",
        163: "2508 Junior Suite (2)",
        164: "3201 Twin Bed (2)",
        165: "3202 Twin Bed (2)",
        166: "3203 Twin Bed (2)",
        167: "3204 Twin Bed (2)",
        168: "3205 Twin Bed (2)",
        169: "3212 Twin Bed (2)",
        170: "3213 Twin Bed (2)",
        171: "3214 Twin Bed (2)",
        172: "3215 Twin Bed (2)",
        173: "3216 Twin Bed (2)",
        174: "3301 Twin Bed (2)",
        175: "3302 Twin Bed (2)",
        176: "3303 Double Bed (2)",
        177: "3304 Twin Bed (2)",
        178: "3305 Twin Bed (2)",
        179: "3306 Twin Bed (2)",
        180: "3307 Twin Bed (2)",
        181: "3308 Twin Bed (2)",
        182: "3309 Twin Bed (2)",
        183: "3310 Twin Bed (2)",
        184: "3311 Twin Bed (2)",
        185: "3312 Twin Bed (2)",
        186: "3313 Twin Bed (2)",
        187: "3314 Double Bed (2)",
        188: "3315 Twin Bed (2)",
        189: "3316 Twin Bed (2)",
        190: "3401 Twin Bed (2)",
        191: "3402 Twin Bed (2)",
        192: "3403 Double Bed (2)",
        193: "3404 Twin Bed (2)",
        194: "3405 Twin Bed (2)",
        195: "3406 Twin Bed (2)",
        196: "3407 Twin Bed (2)",
        197: "3408 Twin Bed (2)",
        198: "3409 Twin Bed (2)",
        199: "3410 Twin Bed (2)",
        200: "3411 Twin Bed (2)",
        201: "3412 Twin Bed (2)",
        202: "3413 Twin Bed (2)",
        203: "3414 Double Bed (2)",
        204: "3415 Twin Bed (2)",
        205: "3416 Twin Bed (2)",
        206: "3501 Twin Bed (2)",
        207: "3502 Twin Bed (2)",
        208: "3503 Double Bed (2)",
        209: "3504 Double Bed (2)",
        210: "3505 Double Bed (2)",
        211: "3506 Double Bed (2)",
        212: "3507 Double Bed (2)",
        213: "3508 Double Bed (2)",
        214: "3509 Double Bed (2)",
        215: "3510 Double Bed (2)",
        216: "3511 Double Bed (2)",
        217: "3512 Double Bed (2)",
        218: "3513 Double Bed (2)",
        219: "3514 Double Bed (2)",
        220: "3515 Twin Bed (2)",
        221: "3516 Twin Bed (2)",
        222: "3601 Double Bed (2)",
        223: "3602 Double Bed (2)",
        224: "3603 Double Bed (2)",
        225: "3604 Double Bed (2)",
        226: "3605 Double Bed (2)",
        227: "3606 Double Bed (2)",
        228: "3608 Ocean Suite (2)",
        229: "3609 Ocean Suite (2)",
        230: "3611 Double Bed (2)",
        231: "3612 Double Bed (2)",
        232: "3613 Double Bed (2)",
        233: "3614 Double Bed (2)",
        234: "3615 Double Bed (2)",
        235: "3616 Double Bed (2)",
        236: "3701 Double Bed (2)",
        237: "3702 Double Bed (2)",
        238: "3703 Double Bed (2)",
        239: "3704 Double Bed (2)",
        240: "3705 Double Bed (2)",
        241: "3706 Double Bed (2)",
        242: "3708 Ocean Suite (2)",
        243: "3709 Ocean Suite (2)",
        244: "3711 Double Bed (2)",
        245: "3712 Double Bed (2)",
        246: "3713 Double Bed (2)",
        247: "3714 Double Bed (2)",
        248: "3715 Double Bed (2)",
        249: "3716 Double Bed (2)"
    }},
    { title: 'เดินทางโดย', field: 'vehicle', type: 'string', lookup: {
        1: "รถบัส(ไม่ระบุ)", 
        2: "รถส่วนตัว", 3: "รถตู้", 4: "รถบัสคันที่ 1", 5: "รถบัสคันที่ 2", 6: "รถบัสคันที่ 3"}},
    { title: 'เข้าร่วม', field: 'join', type: 'string'},
    { title: 'เลือกคู่นอน', field: 'sleepingType', type: 'string',  editable: 'never'},
    { title: 'หมายเหตุ', field: 'roomRemark', type: 'string',  editable: 'never'},
    { title: 'หมายเหตุ Admin', field: 'remark', type: 'string'}
];}