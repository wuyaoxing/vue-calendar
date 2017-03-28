<template>
	<div>
    <calendar
			:calendar="calendar"
			@select="select" @change="change"
		>
		</calendar>
	</div>
</template>
<script>
	import Calendar from '../../components/calendar';
	import data from '../../calendar.json';
	export default {
		name: 'calendars',
		data() {
			return {
				calendar: data
			}
		},
		components: {
			Calendar
		},
		methods: {
			change(date, calendar) {
				console.log(date, calendar);
			},
			select(date, calendar) {
				console.log(date, calendar);
			}
		},
    mounted: function () {
      this.$nextTick(function () {
//        console.log(JSON.stringify(this.calendar, null, 2))
      })
    },
	}
</script>
<style>
</style>
