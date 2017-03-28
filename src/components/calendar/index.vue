<template>
  <div class="calendar" v-resize="resize">
    <div class="calendar-header" ref="calendarHeader">
      <div class="calendar-nav">
        <div class="calendar-nav-prev">
          <a href="javascript:void(0)" @click="prevyear">
            <span class=""> 上一年 </span>
          </a>
          <a href="javascript:void(0)" v-show="view === 0" @click="prevmonth">
            <span class=""> &lt; </span>
          </a>
        </div>
        <div class="calendar-nav-prev">
          <a v-show="view === 0" href="javascript:void(0)" @click="isToday" :disabled="isToday_token">
            <span class="">今天</span>
          </a>
        </div>
        {{position}}
        <div class="calendar-nav-next">
          <a v-show="view === 0" href="javascript:void(0)" @click="nextmonth">
            <span class=""> &gt; </span>
          </a>
          <a href="javascript:void(0)" @click="nextyear">
            <span class="">下一年</span>
          </a>
        </div>
      </div>
      <div class="calendar-title">
        <a href="javascript:void(0)" @click="toYearsView">
          <span>{{ YearTitle }}</span>
        </a>
        <a v-show="view === 0" href="javascript:void(0)" @click="toMonthsView">
          <span>{{ MonthTitle }}</span>
        </a>
      </div>
    </div>
    <table class="calendar-body" ref="calendarBody">
      <thead>
      <tr v-show="view===0">
        <th v-for="weekday in WeekDays">{{ weekday }}</th>
      </tr>
      </thead>
      <tbody id="scrollTbody" class="tw-scrollable-layout" @scroll="onScroll2">
      <tr v-show="view===0" v-for="(rows, r) in Dates">
        <td
          v-for="(col, c) in rows"
          @click="selectdate($event, col,r, c)"
          :style="cellsize"
          :class="col.style"
        >
          <span v-if="col.calendar.endDate">
            {{col.calendar.status.name}}
          </span>
          <div class="date">
            <!--{{col}}-->
            <span>{{ col.date.getDate() }}</span>
            <span v-if="col.calendar.endDate" class="task">{{col.calendar.title}}</span>
          </div>
          <!--<slot :calendar="col">-->
          <!--{{col}}-->
          <!--&lt;!&ndash;{{ col.date.getDate() }}&ndash;&gt;-->
          <!--</slot>-->
        </td>
      </tr>
      <tr v-show="view===1" v-for="(rows, r) in Months" class="calendar-months">
        <td
          v-for="(col, c) in rows"
          @click="selectmonth($event, 4*r+(c+1))"
          :style="cellsize"
        >
          {{ col }}
        </td>
      </tr>
      <tr v-show="view===2" v-for="rows in Years" class="calendar-years">
        <td
          v-for="col in rows"
          @click="selectyear($event, col)"
          :style="cellsize"
        >
          {{ col }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
    import Mixins from '../../js/mixins';

    const WeekDays = {
        base: ['一', '二', '三', '四', '五', '六', '日'],
        fullname: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
        abbreviation: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    };
    export default {
        name: 'calendar',
        mixins: [Mixins],
        props: {
            year: {
                type: Number,
                default() {
                    return new Date().getFullYear();
                }
            },
            month: {
                type: Number,
                default() {
                    return new Date().getMonth() + 1;
                }
            },
            calendar: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                Months: [],// 月份
                WeekDays: WeekDays.fullname, // 周信息
                y: new Date().getFullYear(), // 年
                m: new Date().getMonth() + 1, // 月
                d: new Date().getDate(), // 日
                // 视图模式
                //  0为月视图,1为年视图,2为10年显示视图
                view: 0,
                // 单元格大小
                cellsize: {
                    width: 0,
                    height: 0
                },
                isToday_token: true,
                LastMonthRow: 0,
                ThisMonthRow: 0,
                position: {scrollTop: 300, scrollLeft: 0}
            }
        },
        created() {
            this.y = this.year;
            this.m = this.month;
            this.Months = [];
            const Months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
            // 设置月份视图显示数据
            while (Months.length) {
                this.Months.push(Months.splice(0, 4));
            }
        },
        computed: {
            // 年份标题
            YearTitle() {
                let title = `${this.y} 年`;
                if (this.view === 2) {
                    title = `${this.y - this.y % 10} 年 - ${this.y - this.y % 10 + 10} 年`;
                }
                return title;
            },
            // 月份标题
            MonthTitle() {
                return `${this.m} 月`;
            },
            // 年视图时的年份
            Years() {
                const Years = [];
                const years = [];
                for (let i = 0, length = 10; i < length; i++) {
                    years.push(this.y - this.y % 10 + i);
                }
                while (years.length) {
                    Years.push(years.splice(0, 4));
                }
                return Years;
            },
            // 上上一个月
            LastLastMonth() {
              let year = this.y;
              let month = this.m - 2;
              if (month < 1) {
                month = 12;
                year -= 1;
              }
              let days = new Date(year, month, 0).getDate();
              return {
                year: year,
                month: month,
                days: days
              };
            },
            // 上一个月
            LastMonth() {
                let year = this.y;
                let month = this.m - 1;
                if (month < 1) {
                    month = 12;
                    year -= 1;
                }
                let days = new Date(year, month, 0).getDate();
                return {
                    year: year,
                    month: month,
                    days: days
                };
            },
            // 当前月
            ThisMonth() {
                let year = this.y;
                let month = this.m;
                let days = new Date(year, month, 0).getDate();
                return {
                    year: year,
                    month: month,
                    days: days
                };
            },
            // 下一个月
            NextMonth() {
                let year = this.y;
                let month = this.m + 1;
                if (month > 12) {
                    month = 1;
                    year += 1;
                }
                let days = new Date(year, month, 0).getDate();
                return {
                    year: year,
                    month: month,
                    days: days
                };
            },
            // 渲染日程表天数
            Dates() {
                const days = [];
                const dates = [];
                const calendar = {};
//                const calendar = new Map();
                // 把本月日程转换为以时间为key的对象
              console.log(calendar)
                for (let i = 0, length = this.calendar[0].grids.length; i < length; i++) {
                    let time = this.calendar[0].grids[i].endDate.split(/-|\s/);
                    // 去掉前置0
                    time = `${parseInt(time[0])}${parseInt(time[1])}${parseInt(time[2])}`;
                    calendar[time] = this.calendar[0].grids[i];
//                      let calendarA = []
//                      calendarA.push(this.calendar[i])
//                      calendar.set(calendar[time], calendarA);
                }
                // 当前月第一天的星期数
                let LastMonthLastDayWeek = new Date(this.LastMonth.year, this.LastMonth.month, 0).getDay();

                // Me

                // 上上第一天的星期数
                let LastLastMonthLastDayWeek = new Date(this.LastLastMonth.year, this.LastLastMonth.month, 0).getDay();

                // 当前月第一天的星期数
                let ThisMonthThisDayWeek = new Date(this.ThisMonth.year, this.ThisMonth.month, 0).getDay();

                // 下月第一天的星期数
                let NextMonthNextDayWeek = new Date(this.NextMonth.year, this.NextMonth.month, 0).getDay();

                // 上上月的最后一天的日期
                let LastLastMonthLastDay = new Date(this.LastLastMonth.year, this.LastLastMonth.month, 0).getDate();

                // 上月的最后一天的日期
                let LastMonthLastDay = new Date(this.LastMonth.year, this.LastMonth.month, 0).getDate();

                // 当前月的最后一天的日期
                let ThisMonthLastDay = new Date(this.ThisMonth.year, this.ThisMonth.month, 0).getDate();

                // 下月的最后一天的日期
                let NextMonthLastDay = new Date(this.NextMonth.year, this.NextMonth.month, 0).getDate();

                let LastLastDay = LastLastMonthLastDayWeek + LastMonthLastDay;

                // Me

                this.LastMonthRow = Math.floor((LastMonthLastDay + LastLastMonthLastDayWeek)/7)
                this.LastLastMonthRow = Math.ceil((LastLastMonthLastDay - LastLastMonthLastDayWeek)/7)
                this.ThisMonthRow = Math.floor((ThisMonthLastDay + LastMonthLastDayWeek)/7)

                // 生成显示日程的二维数组
                for (let i = 1; i <= Math.ceil((LastMonthLastDay + ThisMonthLastDay + NextMonthLastDay + LastLastMonthLastDayWeek)/7)*7; i++) {
                    // 获取日期
                    let date = new Date(this.ThisMonth.year, this.ThisMonth.month - 1, i - LastLastDay);
                    // 样式
                    let style = [];
                    if (i - LastLastDay <= 0) {
                        // 上一个月样式
                        style.push('last-month');
                    } else if (i - LastLastDay > new Date(this.ThisMonth.year, this.ThisMonth.month, 0).getDate()) {
                        // 下一个月样式
                        style.push('next-month');
                    } else {
                        // 本月样式
                        style.push('this-month');
                        const today = new Date();
                        // 让今天高亮
                        if (today.getFullYear() === date.getFullYear()
                            && today.getMonth() === date.getMonth()
                            && today.getDate() === date.getDate()) {
                            style.push('today');
                        }
                    }
                    // 日程对象的下标值(key)
                    let time = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
                    days.push({
                        date: date,
                        style: style,
                        calendar: calendar[time] || {}
                    });
                    // 每7天就添加到下一行
                    if (i % 7 === 0) {
                        dates.push(days.splice(0, 7));
                    }
                }
                return dates;
            }
        },
        watch: {
            // 视图类型改变时
            view(nVal, oVal) {
                let width = this.$refs.calendarBody.clientWidth;
                if (nVal === 0) {
                    width = (width / 7).toFixed(2);
                } else {
                    width = (width / 4).toFixed(2);
                }
                this.cellsize = {
                    width: `${width}px`,
                    height: `${width}px`
                }
            }
        },
        mounted: function () {
          this.$nextTick(function () {
            this.initScroll();
//            console.log(JSON.stringify(this.Dates, null, 2))
          })
        },
        methods: {
          initScroll: function(type) {
            let st = document.getElementById('scrollTbody');
            let sttr = st.getElementsByTagName('tr')[0];
            if (type === 'prev') {
              st.scrollTop = sttr.offsetHeight * this.LastLastMonthRow;
            } else if (type === 'next') {
              st.scrollTop = sttr.offsetHeight * this.ThisMonthRow;
            } else {
              st.scrollTop = sttr.offsetHeight * this.LastMonthRow;
            }
          },
          onScroll2: function(e){
            if(this.view !== 0){
              return;
            }
//            console.log(e)
            let scrollTop = e.target.scrollTop;
            let scrollHeight = e.target.scrollHeight;
            let clientHeight = e.target.clientHeight;
            let offsetHeight = e.target.childNodes[0].offsetHeight;

            this.position.scrollTop = scrollTop;

            if (scrollTop < offsetHeight) {
              this.prevmonth()
              console.log('last:'+this.LastLastMonthRow);
              e.target.scrollTop = offsetHeight * this.LastLastMonthRow;
            } else if (scrollTop > scrollHeight - offsetHeight - clientHeight) {
              this.nextmonth()
              console.log('next:'+this.ThisMonthRow);
              e.target.scrollTop = offsetHeight * this.ThisMonthRow;
            }
          },
            // 设置为年视图
            toYearsView(e) {
                this.view = 2;
            },
            // 设置为月视图
            toMonthsView(e) {
                this.view = 1;
            },
            // 切换年prev
            // 如果为年视图就调整10年否则就为1年
            prevyear(e) {
                let year = this.y - 1;
                if (this.view === 2) {
                    year = this.y - 10;
                }
                let month = this.m;
                this.y = year;
                this.m = month;
                if (this.view === 0) {
                    this.$emit('change', year, month);
                }
            },
            // 切换到上一个月
            prevmonth(e) {
//                console.log(e)
//                console.log(e.target.offsetParent.scrollTbody)
                let year = this.y;
                let month = this.m - 1;
                if (month < 1) {
                    year -= 1;
                    month = 12;
                }
                this.y = year;
                this.m = month;
                this.$emit('change', year, month);
                this.isToday_tokenf()
                this.initScroll('prev');
            },
            // 切换年next
            // 如果为年视图就调整10年否则就为1年
            nextyear(e) {
                let year = this.y + 1;
                if (this.view === 2) {
                    year = this.y + 10;
                }
                let month = this.m;
                this.y = year;
                this.m = month;
                if (this.view === 0) {
                    this.$emit('change', year, month);
                }
            },
            isToday_tokenf(e) {
              let year = new Date().getFullYear()// 年;
              let month = new Date().getMonth() + 1 // 月;

              if (this.y === year && this.m === month) {
                this.isToday_token = true;
              } else {
                this.isToday_token = false;
              }
            },
            isToday(e) {
              let year = new Date().getFullYear()// 年;
              let month = new Date().getMonth() + 1 // 月;

              this.y = year;
              this.m = month;
              this.$emit('change', year, month);
              this.isToday_tokenf();
              this.initScroll();
            },
            // 切换到下一个月
            nextmonth(e) {
                let year = this.y;
                let month = this.m + 1;
                if (month > 12) {
                    month = 1;
                    year += 1;
                }
                this.y = year;
                this.m = month;
                this.$emit('change', year, month);
                this.isToday_tokenf()
                this.initScroll('next');
            },
            // 选定年
            selectyear(e, year) {
                this.y = year;
                this.view = 1;
            },
            // 选定月
            selectmonth(e, month) {
                this.m = month;
                this.view = 0;
                this.$emit('change', this.y, this.m);
            },
            // 选择天
            selectdate(e, date, row, col) {
                const isThisMonth = date.date.getMonth() + 1 === this.m;
                this.y = date.date.getFullYear();
                this.m = date.date.getMonth() + 1;
                this.d = date.date.getDate();
                if (!isThisMonth) {
                    this.$emit('change', this.y, this.m);
                } else {
                    this.$emit('select', {
                        year: this.y,
                        month: this.m,
                        date: this.d
                    }, date.calendar);
                }
            },
            // v-resize指令函数
            resize(el) {
                this.$refs.calendarHeader.style.width = `${this.$refs.calendarBody.clientWidth}px`;
                let width = this.$refs.calendarBody.clientWidth;
                if (this.view === 0) {
                    width = (width / 7).toFixed(2);
                } else {
                    width = (width / 4).toFixed(2);
                }
                this.cellsize = {
                    width: `${width}px`,
                    height: `${width}px`
                }
                if (width >= 60 && width < 100) {
                    this.WeekDays = WeekDays.abbreviation;
                } else if (width < 60) {
                    this.WeekDays = WeekDays.base;
                } else {
                    this.WeekDays = WeekDays.fullname;
                }
            }
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .calendar, .calendar *
    box-sizing border-box
  .calendar
    background-color #fff
    padding 7px
    text-align center
    .calendar-header
      min-width 100%
      padding 10px
      font-size 18px
      color #555555
      a
        margin 0
        padding 4px
        color #555555
        text-decoration none
        outline none
        &:hover, &:active
          outline none
          text-decoration none
          color #20a0ff
        &:focus
           color #555555
      .calendar-nav
        .calendar-nav-prev
          float left
        .calendar-nav-next
          float right
        a
          display inline-block
          width auto
          height 30px
          padding 5px
          line-height normal
        .calendar-title
          margin 0 2*30px
    .calendar-body
      width 100%
      thead th
        padding 10px
        font-weight 400
        font-size 20px
        color #555555
      tbody
        /*border 1px solid #ddd*/
        height 80%
        position absolute
      tbody td
        height 140px!important
        padding 10px
        text-align center
        cursor pointer
        font-size 20px
        position relative
        border-radius 5px
        &.this-month
           color #555555
           background #EDEFF0
           &:hover
             background-color #dedede
             color #20a0ff
           &.today
             background-color mix(#fff, #0000ff, 60%)
             color #fff
        &.last-month, &.next-month
           color lighten(#555555, 32%)
        .date
          .task
            display block
            /*color #f00*/
            position absolute
            right 0
            top 0
      tbody .calendar-years, tbody .calendar-months
        td
          color #555555
          &:hover
             background-color mix(#fff, #0000ff, 96%)
             color: #20a0ff

  /*滚动条样式*/
  .tw-scrollable-layout
    overflow-y auto
    overflow-x hidden
    -webkit-overflow-scrolling touch
    &::-webkit-scrollbar
      background transparent
      width 8px
      height 8px
    &::-webkit-scrollbar-track
      background: #f3f4f5;
      width 8px
      height 8px
      border-radius 4px
    &::-webkit-scrollbar-thumb
      background #b0b4bb
      width 8px
      height 8px
      border-radius 4px
    &::-webkit-scrollbar-thumb:hover
      background #c1c4cb
    &.\--only-show-scrollbar-while-hover:not(:hover)::-webkit-scrollbar-track,
    &.\--only-show-scrollbar-while-hover:not(:hover)::-webkit-scrollbar-thumb,
    &.\--only-show-scrollbar-while-hover:not(:hover)::-webkit-scrollbar-thumb:hover
      background none
    &.\--parallax
      -webkit-perspective 1px
      perspective 1px

</style>
