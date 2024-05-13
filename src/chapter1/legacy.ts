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

    get hasInvitation(): boolean {
      return this.invitation !== null;
    }

    get hasTicket(): boolean {
      return this.ticket !== null;
    }

    setTicket = (ticket: Ticket) => {
      this.ticket = ticket;
    };

    minusAmount = (amount: number) => {
      this.amount -= amount;
    };

    plusAmount = (amount: number) => {
      this.amount += amount;
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
  }

  class TicketOffice {
    constructor(private amount: number, private tickets: Array<Ticket>) {}

    get getTicket() {
      const ticket = this.tickets[0];
      this.tickets = this.tickets.filter((_, index: number) => index !== 0);
      return ticket;
    }

    minusAmount(amount: number) {
      this.amount -= amount;
    }

    plusAmount(amount: number) {
      this.amount += amount;
    }
  }

  class TicketSeller {
    constructor(private ticketOffice: TicketOffice) {}

    get getTicketOffice(): TicketOffice {
      return this.ticketOffice;
    }
  }

  class Theater {
    constructor(private ticketSeller: TicketSeller) {}

    enter = (audience: Audience) => {
      if (audience.getBag.hasInvitation) {
        const ticket: Ticket = this.ticketSeller.getTicketOffice.getTicket;
        audience.getBag.setTicket(ticket);
      } else {
        const ticket = this.ticketSeller.getTicketOffice.getTicket;
        audience.getBag.minusAmount(ticket.getFee);
        this.ticketSeller.getTicketOffice.plusAmount(ticket.getFee);
        audience.getBag.setTicket(ticket);
      }
    };
  }
}
