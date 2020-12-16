import mongoose from 'mongoose';

interface TicketAttrs {
    title: string; 
    price: number; 
};

export interface TicketDoc extends mongoose.Document {
    title: string; 
    price: number; 
};

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
};

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

schema.statics.build((attrs: TicketAttrs) => new Ticket(attrs));

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", schema);

export { Ticket };