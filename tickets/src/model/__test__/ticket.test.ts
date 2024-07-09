import { Ticket } from "../tickes"

it('check if throw error when versions are not consistent',async()=>{
    // Create a new ticket
    const ticket = Ticket.build({
        title:"queen tour",
        price:200,
        userId:"dfewkd"
    })

    await ticket.save();
    // Fetch two instance
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // Update and save first instance
    firstInstance?.set({price:100});
    await firstInstance?.save();

    // Update and save second instance and expect an error
    try{
    secondInstance?.set({price: 50});
    await secondInstance?.save();
    }catch(err){
        console.log(err);
    }
})


it("check if increasing version number on multiple saves or updates",async()=>{
    const ticket = Ticket.build({
        title:"queen tour",
        price:200,
        userId:"dfewkd"
    })

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2)
})