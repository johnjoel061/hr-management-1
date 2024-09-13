const Calendar = require("../models/calendarModel");
const AppError = require("../utils/appError"); // Ensure this is the correct import

// Controller to add an event
exports.addEvent = async (req, res, next) => {
  try {
    const newEvent = new Calendar({
      title: req.body.title,
      start: req.body.start,
      end: req.body.end,
      allDay: req.body.allDay,
    });

    await newEvent.save();

    res.status(201).json({
      status: "success",
      message: "Event added successfully",
      data: {
        _id: newEvent._id,
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
        allDay: newEvent.allDay,
        createdAt: newEvent.createdAt,
        updatedAt: newEvent.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Controller to get all events
exports.getAllEvents = async (req, res, next) => {
  try {
    const events = await Calendar.find();

    res.status(200).json({
      status: "success",
      results: events.length,
      data: events.map((event) => ({
        _id: event._id,
        title: event.title,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// Controller to get event by ID
exports.getEventById = async (req, res, next) => {
  try {
    const event = await Calendar.findById(req.params.id);

    if (!event) {
      return next(new AppError("Event not found", 404)); // Use 'new'
    }

    res.status(200).json({
      status: "success",
      data: {
        event,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Controller to delete event by ID
exports.deleteEventById = async (req, res, next) => {
  try {
    const deletedEvent = await Calendar.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return next(new AppError("Event not found", 404)); // Use 'new'
    }

    res.status(200).json({
      status: "success",
      message: "Event deleted successfully",
      data: {
        event: deletedEvent,
      },
    });
  } catch (error) {
    next(error);
  }
};
