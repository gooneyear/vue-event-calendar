'use strict'

import vueBimonthlyCalendar from './vue-bimonthly-calendar.vue'

function install (Vue, options = {}) {
  const isVueNext = Vue.version.split('.')[0] === '2'
  const inBrowser = typeof window !== 'undefined'
  let dateObj = new Date()
  let lastYearShow = "";
  let lastMonthShow = "";
  if(dateObj.getMonth() == 0){
    lastYearShow = dateObj.getFullYear()-1;
    lastMonthShow = 11;
  } else {
    lastYearShow = dateObj.getFullYear();
    lastMonthShow = dateObj.getMonth()-1;
  }
  const DEFAULT_OPTION = {
    locale: 'zh', // en
    color: ' #0a81e5',
    className:'selected-day',
    weekStartOn: 1 // 0 mean sunday
  }
  let Calendar = {
    $vm: null,
    bindEventBus (vm) {
      this.$vm = vm
    },
    toDate (dateString) {
      if (dateString === 'all') {
        this.$vm.CALENDAR_EVENTS_DATA.params = {
          curYear: dateObj.getFullYear(),
          curMonth: dateObj.getMonth(),
          curDate: dateObj.getDate(),
          curEventsDate: 'all'
        }
      } else {
        let dateArr = dateString.split('/')
        dateArr = dateArr.map((item) => {
          return parseInt(item, 10)
        })
        this.$vm.CALENDAR_EVENTS_DATA.params = {
          curYear: dateArr[0],
          curMonth: dateArr[1]-1,
          curDate: dateArr[2],
          curEventsDate: dateString
        }
      }
    },
    nextMonth () {
      if (this.$vm.CALENDAR_EVENTS_DATA.params.curMonth < 11) {
        this.$vm.CALENDAR_EVENTS_DATA.params.curMonth++
      } else {
        this.$vm.CALENDAR_EVENTS_DATA.params.curYear++
        this.$vm.CALENDAR_EVENTS_DATA.params.curMonth = 0
      }
      if (this.$vm.CALENDAR_EVENTS_DATA.params.lastMonth < 11) {
        this.$vm.CALENDAR_EVENTS_DATA.params.lastMonth++
      } else {
        this.$vm.CALENDAR_EVENTS_DATA.params.lastYear++
        this.$vm.CALENDAR_EVENTS_DATA.params.lastMonth = 0
      }
    },
    preMonth () {
      if (this.$vm.CALENDAR_EVENTS_DATA.params.curMonth > 0) {
        this.$vm.CALENDAR_EVENTS_DATA.params.curMonth--
      } else {
        this.$vm.CALENDAR_EVENTS_DATA.params.curYear--
        this.$vm.CALENDAR_EVENTS_DATA.params.curMonth = 11
      }
      if (this.$vm.CALENDAR_EVENTS_DATA.params.lastMonth > 0) {
        this.$vm.CALENDAR_EVENTS_DATA.params.lastMonth--
      } else {
        this.$vm.CALENDAR_EVENTS_DATA.params.lastYear--
        this.$vm.CALENDAR_EVENTS_DATA.params.lastMonth = 11
      }
    }
  }

  const calendarOptions = Object.assign(DEFAULT_OPTION, options)

  const VueCalendarBarEventBus = new Vue({
    data: {
      CALENDAR_EVENTS_DATA: {
        options: calendarOptions,
        params: {
          curYear: dateObj.getFullYear(),
          lastYear: lastYearShow,
          curMonth: dateObj.getMonth(),
          lastMonth: lastMonthShow,
          curDate: dateObj.getDate(),
          curEventsDate: 'all'
        }
      }
    }
  })

  if (inBrowser) {
    window.VueCalendarBarEventBus = VueCalendarBarEventBus
    Calendar.bindEventBus(VueCalendarBarEventBus)
  }

  Vue.component('vue-bimonthly-calendar', vueBimonthlyCalendar)

  Vue.prototype.$EventCalendar = Calendar
}

export default install

if (typeof module === 'object' && module.exports) {
  module.exports.install = install
}
