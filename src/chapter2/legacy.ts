{
  class Movie {
    constructor(
      private title: string,
      private runningTime: number,
      private fee: Money,
      private discountPolicy: DiscountPolicy
    ) {
      this.title = title;
      this.runningTime = runningTime;
      this.fee = fee;
      this.discountPolicy = discountPolicy;
    }

    getFee() {
      return this.fee;
    }

    calculateMovieFee(screening: Screening) {
      return this.fee.minus(
        this.discountPolicy.calculateDiscountAmount(screening)
      );
    }
  }

  class Customer {
    constructor() {}
  }

  class Money {
    static readonly ZERO = Money.wons(0);

    constructor(private amount: number) {}

    static wons(amount: number) {
      return new Money(amount);
    }

    getAmount(): number {
      return this.amount;
    }

    plus(amount: Money): Money {
      return new Money(this.amount + amount.getAmount());
    }

    minus(amount: Money): Money {
      return new Money(this.amount - amount.getAmount());
    }

    times(percent: number): Money {
      return new Money(this.amount * percent);
    }

    isLessThan(other: Money): boolean {
      return this.amount < other.getAmount();
    }

    isGreaterThanOrEqual(other: Money): boolean {
      return this.amount >= other.getAmount();
    }
  }

  class Screening {
    constructor(
      private movie: Movie,
      private sequence: number,
      private whenScreened: Date
    ) {
      this.movie = movie;
      this.sequence = sequence;
      this.whenScreened = whenScreened;
    }

    getStartTime() {
      return this.whenScreened;
    }

    isSequence(sequence: number) {
      return this.sequence === sequence;
    }

    getMovieFee() {
      return this.movie.getFee();
    }

    reserve(customer: Customer, audienceCount: number) {
      return new Reservation(
        customer,
        this,
        this.calculateFee(audienceCount),
        audienceCount
      );
    }

    calculateFee(audienceCount: number) {
      return this.movie.calculateMovieFee(this).times(audienceCount);
    }
  }

  class Reservation {
    constructor(
      private customer: Customer,
      private screening: Screening,
      private fee: Money,
      private audienceCount: number
    ) {
      this.customer = customer;
      this.screening = screening;
      this.fee = fee;
      this.audienceCount = audienceCount;
    }
  }

  interface DiscountCondition {
    isSatisfiedBy(screening: Screening): boolean;
  }

  abstract class DiscountPolicy {
    constructor(private conditions: Array<DiscountCondition>) {
      this.conditions = [...conditions];
    }

    calculateDiscountAmount(screening: Screening) {
      const conditions = this.conditions.filter((condition) =>
        condition.isSatisfiedBy(screening)
      );

      if (conditions.length) {
        return this.getDiscountAmount(screening);
      } else return Money.ZERO;
    }

    abstract getDiscountAmount(screening: Screening): Money;
  }

  class SequenceCondition implements DiscountCondition {
    constructor(private sequence: number) {
      this.sequence = sequence;
    }

    isSatisfiedBy(screening: Screening) {
      return screening.isSequence(this.sequence);
    }
  }

  class PeriodCondition implements DiscountCondition {
    constructor(
      private DayOfWeek: number,
      private startTime: number,
      private endTime: number
    ) {
      this.DayOfWeek = DayOfWeek;
      this.startTime = startTime;
      this.endTime = endTime;
    }

    isSatisfiedBy(screening: Screening): boolean {
      return (
        screening.getStartTime().getDay() === this.DayOfWeek &&
        this.startTime <= screening.getStartTime().getTime() &&
        this.endTime >= screening.getStartTime().getTime()
      );
    }
  }

  class AmountDiscountPolicy extends DiscountPolicy {
    constructor(
      private discountAmount: Money,
      conditions: Array<DiscountCondition>
    ) {
      super(conditions);
      this.discountAmount = discountAmount;
    }

    getDiscountAmount(screening: Screening) {
      return this.discountAmount;
    }
  }

  class PercentDiscountPolicy extends DiscountPolicy {
    constructor(private percent: number, conditions: Array<DiscountCondition>) {
      super(conditions);
      this.percent = percent;
    }

    getDiscountAmount(screening: Screening) {
      return screening.getMovieFee().times(this.percent);
    }
  }

  class Duration {
    constructor(private minutes: number) {
      this.minutes = minutes;
    }

    static ofMinutes(minutes: number) {
      return new Duration(minutes);
    }

    getMinutes() {
      return this.minutes;
    }
  }

  enum DayOfWeek {
    SUNDAY,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
  }

  class LocalTime {
    private constructor(private hours: number, private minutes: number) {
      this.hours = hours;
      this.minutes = minutes;
    }

    static of(hours: number, minutes: number) {
      return new LocalTime(hours, minutes);
    }

    getTime(): number {
      return this.hours * 60 + this.minutes;
    }
  }

  const avatar = new Movie(
    "아바타",
    Duration.ofMinutes(120).getMinutes(),
    Money.wons(10000),
    new AmountDiscountPolicy(Money.wons(800), [
      new SequenceCondition(1),
      new SequenceCondition(10),
      new PeriodCondition(
        DayOfWeek.MONDAY,
        LocalTime.of(10, 0).getTime(),
        LocalTime.of(11, 59).getTime()
      ),
      new PeriodCondition(
        DayOfWeek.THURSDAY,
        LocalTime.of(10, 0).getTime(),
        LocalTime.of(20, 59).getTime()
      ),
    ])
  );

  const titanic = new Movie(
    "타이타닉",
    Duration.ofMinutes(180).getMinutes(),
    Money.wons(11000),
    new PercentDiscountPolicy(0.1, [
      new PeriodCondition(
        DayOfWeek.TUESDAY,
        LocalTime.of(14, 0).getTime(),
        LocalTime.of(16, 59).getTime()
      ),
      new SequenceCondition(2),
      new PeriodCondition(
        DayOfWeek.THURSDAY,
        LocalTime.of(10, 0).getTime(),
        LocalTime.of(13, 59).getTime()
      ),
    ])
  );

  console.log("avatar", avatar);
  console.log("titanic", titanic);
}
