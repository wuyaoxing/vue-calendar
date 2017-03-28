## Calendar组件调用方法
    <calendar
        :year="year"
        :month="month"
        :calendar="calendar"
        @select="select"
        @change="change"
    >
        <!--替换渲染日程表单元格内容-->
        <!--date为单元格中的数据-->
        <template scope="date">
            <div
                class="date"
                :class="{ active: date.calendar.calendar.data}"
            >
                <span>{{ date.calendar.date.getDate() }}</span>
                <span class="el-icon-star-on"></span>
            </div>
        </template>
    </calendar>

## 参数说明
参数 | 类型 | 说明 | 是否可选 | 默认值
--- | --- | --- | --- | ---
year | Number | 年份 | 是 | 当前年份
month | Number | 月份 | 是 | 当前月份
## 事件
事件名 | 回调参数 | 说明
--- | --- | ---
select | date时间，calendar日程安排 | 日程选择
change | year年份，month月份 | 年份月份改变事件