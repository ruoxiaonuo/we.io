class Lunar {
    constructor() {
        this.lunarInfo = [
            0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
            0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
            0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
            0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
            0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
            0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
            0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
            0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
            0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
            0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
            0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
            0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
            0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
            0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
            0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0
        ];
        
        this.solarTerms = [
            "小寒", "大寒", "立春", "雨水", "惊蛰", "春分",
            "清明", "谷雨", "立夏", "小满", "芒种", "夏至",
            "小暑", "大暑", "立秋", "处暑", "白露", "秋分",
            "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"
        ];
        
        this.festivals = {
            solar: {
                "01-01": "元旦",
                "02-14": "情人节",
                "03-08": "妇女节",
                "03-12": "植树节",
                "04-01": "愚人节",
                "05-01": "劳动节",
                "05-04": "青年节",
                "06-01": "儿童节",
                "07-01": "建党节",
                "08-01": "建军节",
                "09-10": "教师节",
                "10-01": "国庆节",
                "12-24": "平安夜",
                "12-25": "圣诞节"
            },
            lunar: {
                "01-01": "春节",
                "01-15": "元宵节",
                "02-02": "龙抬头",
                "05-05": "端午节",
                "07-07": "七夕节",
                "08-15": "中秋节",
                "09-09": "重阳节",
                "12-08": "腊八节",
                "12-23": "小年",
                "12-30": "除夕"
            }
        };

        this.Gan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
        this.Zhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
        this.Animals = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
        this.lunarDays = ["初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
            "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
            "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"];
        this.lunarMonths = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"];

        this.termInfo = [
            0, 21208, 42467, 63836, 85337, 107014,
            128867, 150921, 173149, 195551, 218072, 240693,
            263343, 285989, 308563, 331033, 353350, 375494,
            397447, 419210, 440795, 462224, 483532, 504758
        ];

        this.specialDates = {
            solar: ["02-29"],
            lunar: ["10-18"]
        };
    }

    getLunarDate(year, month, day) {
        if (year < 1900 || year > 2100) {
            return {
                year: "Unknown",
                month: "Unknown",
                day: "Unknown"
            };
        }

        const baseDate = new Date(1900, 0, 31);
        const objDate = new Date(year, month - 1, day);
        
        let offset = Math.floor((objDate - baseDate) / 86400000);

        let lunarYear = 1900;
        let temp = 0;
        for (; lunarYear < 2101 && offset > 0; lunarYear++) {
            temp = this.getLunarYearDays(lunarYear);
            offset -= temp;
        }
        if (offset < 0) {
            offset += temp;
            lunarYear--;
        }

        let lunarMonth = 1;
        let isLeap = false;
        let leapMonth = this.getLeapMonth(lunarYear);

        temp = 0;
        for (; lunarMonth < 13 && offset > 0; lunarMonth++) {
            if (leapMonth > 0 && lunarMonth === (leapMonth + 1) && !isLeap) {
                lunarMonth--;
                isLeap = true;
                temp = this.getLeapMonthDays(lunarYear);
            } else {
                temp = this.getLunarMonthDays(lunarYear, lunarMonth);
            }

            if (isLeap && lunarMonth === (leapMonth + 1)) {
                isLeap = false;
            }

            offset -= temp;
        }

        if (offset === 0 && leapMonth > 0 && lunarMonth === leapMonth + 1) {
            if (isLeap) {
                isLeap = false;
            } else {
                isLeap = true;
                lunarMonth--;
            }
        }

        if (offset < 0) {
            offset += temp;
            lunarMonth--;
        }

        const lunarDay = offset + 1;

        return {
            year: this.getGanZhiYear(lunarYear),
            month: this.getLunarMonth(lunarMonth, isLeap),
            day: this.getLunarDay(lunarDay),
            festival: this.getLunarFestival(lunarMonth, lunarDay),
            solarTerm: this.getSolarTerm(year, month, day)
        };
    }

    getLunarYearDays(year) {
        let sum = 348;
        for (let i = 0x8000; i > 0x8; i >>= 1) {
            sum += (this.lunarInfo[year - 1900] & i) ? 1 : 0;
        }
        return sum + this.getLeapMonthDays(year);
    }

    getLunarMonthDays(year, month) {
        return (this.lunarInfo[year - 1900] & (0x10000 >> month)) ? 30 : 29;
    }

    getLeapMonthDays(year) {
        if (this.getLeapMonth(year)) {
            return (this.lunarInfo[year - 1900] & 0x10000) ? 30 : 29;
        }
        return 0;
    }

    getLeapMonth(year) {
        return this.lunarInfo[year - 1900] & 0xf;
    }

    getGanZhiYear(year) {
        const gan = this.Gan[(year - 4) % 10];
        const zhi = this.Zhi[(year - 4) % 12];
        return gan + zhi + '年';
    }

    getLunarMonth(month, isLeap) {
        return (isLeap ? "闰" : "") + this.lunarMonths[month - 1] + "月";
    }

    getLunarDay(day) {
        return this.lunarDays[day - 1];
    }

    getSolarTerm(year, month, day) {
        const baseDate = new Date(1900, 0, 6, 2, 5);
        const target = new Date(year, month - 1, day);
        const diff = Math.floor((target - baseDate) / (24 * 60 * 60 * 1000));
        
        for (let i = 0; i < 24; i++) {
            const days = this.termInfo[i];
            if (diff === days) {
                return this.solarTerms[i];
            }
        }
        return "";
    }

    getLunarFestival(month, day) {
        const key = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return this.festivals.lunar[key] || "";
    }

    getAllFestivals(year, month, day, lunarDate) {
        const lunarMonth = parseInt(lunarDate.month);
        const lunarDay = parseInt(lunarDate.day);
        const lunarKey = `${String(lunarMonth).padStart(2, '0')}-${String(lunarDay).padStart(2, '0')}`;
        const solarKey = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        const festivals = [];
        
        if (this.festivals.solar[solarKey]) {
            festivals.push(this.festivals.solar[solarKey]);
        }
        
        if (this.festivals.lunar[lunarKey]) {
            festivals.push(this.festivals.lunar[lunarKey]);
        }
        
        const solarTerm = this.getSolarTerm(year, month, day);
        if (solarTerm) {
            festivals.push(solarTerm);
        }

        return festivals;
    }

    isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }
} 