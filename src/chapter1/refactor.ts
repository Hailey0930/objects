{
  class Invitation {
    constructor(private when: Date) {}
  }

  class Ticket {
    constructor(private fee: number) {}

    get getFee(): number {
      return this.fee;
    }
  }

  class Bag {
    private amount: number;
    private invitation: Invitation;
    private ticket: Ticket;

    constructor(amount: number, invitation: Invitation, ticket: Ticket) {
      this.amount = amount;
      this.invitation = invitation;
      this.ticket = ticket;
    }

    hold(ticket: Ticket) {
      if (this.hasInvitation) {
        this.setTicket(ticket);
        return 0;
      } else {
        this.setTicket(ticket);
        this.minusAmount(ticket.getFee);
        return ticket.getFee;
      }
    }

    setTicket = (ticket: Ticket) => {
      this.ticket = ticket;
    };

    get hasInvitation(): boolean {
      return this.invitation !== null;
    }

    get hasTicket(): boolean {
      return this.ticket !== null;
    }

    minusAmount = (amount: number) => {
      this.amount -= amount;
    };
  }

  class Audience {
    private bag: Bag;

    constructor(bag: Bag) {
      this.bag = bag;
    }

    get getBag(): Bag {
      return this.bag;
    }

    buy = (ticket: Ticket) => {
      return this.bag.hold(ticket);
    };
  }

  class TicketOffice {
    constructor(private amount: number, private tickets: Array<Ticket>) {}

    sellTicketTo(audience: Audience) {
      const ticketPrice = audience.buy(this.getTicket);
      this.plusAmount(ticketPrice);
      return ticketPrice;
    }

    get getTicket() {
      const ticket = this.tickets.shift();

      if (!ticket) {
        throw new Error("No ticket");
      }

      return ticket;
    }

    plusAmount(amount: number) {
      this.amount += amount;
    }
  }

  class TicketSeller {
    constructor(private ticketOffice: TicketOffice) {
      this.ticketOffice = ticketOffice;
    }

    sellTicketTo = (audience: Audience): number => {
      return this.ticketOffice.sellTicketTo(audience);
    };
  }

  class Theater {
    constructor(private ticketSeller: TicketSeller) {
      this.ticketSeller = ticketSeller;
    }

    enter = (audience: Audience) => {
      return this.ticketSeller.sellTicketTo(audience);
    };
  }

  const invitation = new Invitation(new Date());
  const ticket = new Ticket(100);
  const bag = new Bag(200, invitation, ticket);
  const audience = new Audience(bag);
  const ticketOffice = new TicketOffice(1000, [ticket]);
  const ticketSeller = new TicketSeller(ticketOffice);
  const theater = new Theater(ticketSeller);

  console.log(theater.enter(audience));
}
