import { Component , Input, OnInit} from '@angular/core';
import { CalendarAppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'angular-event-calendar';

  @Input()
  public activeDate: Date;
  public selectedDayIndex: number;
  public selectedWeekIndex: number;
  public months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  public weeks: any [];
  public selectedYear: number;
  public selectedMonth: number;
  public selectedMonthName: string;
  public selectedDay: number;
  public selectedDayName: string;
  public activeDayObject: any;
  public daysInMonthArray: number[];
  public events: any[];

  constructor(private CalendarAppService: CalendarAppService) {
  }

  ngOnInit() {
    this.initializeYear(new Date());
    this.CalendarAppService.initializeCalendarInfo().subscribe(data => {
      const calendarId = data.data.id
      this.CalendarAppService.getEventCalendarEvents(calendarId).subscribe(data => {
        this.events = data.data.items;
        this.generateCalendar(this.events);
      });
    });
  }

  public previousYear() {
    this.selectedYear--;
    this.initializeYear();
  }

  public nextYear() {
    this.selectedYear++;
    this.initializeYear();
  }

  public monthSelection(monthIndex: number, selectedDay = 1) {
    this.selectedMonth = monthIndex;
    this.selectedMonthName = this.months[monthIndex];
    this.activeDate = new Date(this.selectedYear, this.selectedMonth, selectedDay);
    this.selectedDay = this.activeDate.getDate();
    this.selectedDayName = this.dayNames[this.activeDate.getDay()];
    this.daysInMonthArray = new Array<number>(this.daysInMonth(this.selectedMonth, this.selectedYear));
    this.generateCalendar(this.events)
  }

  public daySelection(dayIndex: number, weekIndex: number) {
    if (this.weeks[weekIndex].days[dayIndex].isNextMonthsDay) {
      this.monthSelection(++this.selectedMonth, this.weeks[weekIndex].days[dayIndex].number);
      return;
    }
    this.selectedDayIndex = dayIndex;
    this.selectedWeekIndex = weekIndex;
    this.activeDate = new Date(this.selectedYear, this.selectedMonth, this.weeks[weekIndex].days[dayIndex].number);
    this.activeDayObject = this.weeks[weekIndex].days[dayIndex];
    this.selectedDay = this.activeDate.getDate();
    this.selectedDayName = this.dayNames[this.activeDate.getDay()];
  }

  private daysInMonth = (month, year): number => new Date(year, month + 1, 0).getDate();

  private initializeYear = (date = new Date(this.selectedYear, this.selectedMonth, 1)) => {
    this.activeDate = date;
    this.selectedYear = this.activeDate.getFullYear();
    this.selectedMonth = this.activeDate.getMonth();
    this.selectedMonthName = this.months[this.selectedMonth];
    this.selectedDay = this.activeDate.getDate();
    this.selectedDayName = this.dayNames[this.activeDate.getDay()];
    this.daysInMonthArray = new Array(this.daysInMonth(this.selectedMonth, this.selectedYear));
    this.generateCalendar(this.events)
  };

  private generateCalendar = (events = []) => {
    this.weeks = new Array();
    let dayCounter = 1;
    let nextMonthDayCounter = 0;
    const firstWeekdayOfMonth = new Date(this.selectedYear, this.selectedMonth, 1).getDay();
    const noOfWeeksInMonth = this.numberOfWeeksToBeRenderedForCurrentMonth();
    for (let weekIndex = 0; weekIndex < noOfWeeksInMonth; weekIndex++) {
      const week = {
        days: new Array(7)
      };
      let dayIndex = 0;
      if (weekIndex === 0) {
        dayIndex = firstWeekdayOfMonth;
      }
      for (; dayIndex < week.days.length; dayIndex++) {
        if (dayCounter > this.daysInMonthArray.length) {
          week.days[dayIndex] = {
            number: nextMonthDayCounter,
            date: new Date(this.selectedYear, this.selectedMonth + 1, nextMonthDayCounter),
            isNextMonthsDay: true,
            events: new Array()
          };
          nextMonthDayCounter++;
        } else {
          const todaysEvents = events.filter(event => event.start_datetime.split('-')[2].split(' ')[0] == dayCounter &&
          event.start_datetime.split('-')[1] == (this.selectedMonth + 1) &&
          event.start_datetime.split('-')[0] == this.selectedYear);
          if (dayCounter === this.activeDate.getDate()) {
            this.selectedDayIndex = dayIndex;
            this.selectedWeekIndex = weekIndex;
          }
          week.days[dayIndex] = {
            number: dayCounter,
            date: new Date(this.selectedYear, this.selectedMonth, dayCounter),
            isNextMonthsDay: false,
            events: todaysEvents[0] ? todaysEvents[0] : new Array()
          };
        }
        dayCounter++;
      }
      this.weeks.push(week);
    }
    this.activeDayObject = this.weeks[this.selectedWeekIndex].days[this.selectedDayIndex];
  };

  private numberOfWeeksToBeRenderedForCurrentMonth = (): number => {
    return Math.ceil(this.daysInMonthArray.length / this.dayNames.length) + 1;
  };
}
