const { Announcement, Poll, LostAndFound } = require('../models/Community');

// Get All Community Feed
exports.getCommunityData = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    const polls = await Poll.find({ isActive: true });
    const lostAndFound = await LostAndFound.find({ isResolved: false }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { announcements, polls, lostAndFound }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching community data', error: error.message });
  }
};

// Create Announcement (Admin/Manager)
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, description, date, location, type } = req.body;
    const announcement = await Announcement.create({ title, description, date, location, type });
    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating announcement', error: error.message });
  }
};

// Vote on Poll
exports.votePoll = async (req, res) => {
  try {
    const { pollId, optionId } = req.body;
    const userId = req.user._id;

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ success: false, message: 'Poll not found' });

    // Check if user already voted in any option
    poll.options.forEach((opt) => {
      opt.votes = opt.votes.filter((id) => id.toString() !== userId.toString());
    });

    // Add vote to selected option
    const selectedOption = poll.options.id(optionId);
    if (selectedOption) {
      selectedOption.votes.push(userId);
    }

    await poll.save();
    res.status(200).json({ success: true, data: poll });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error submitting vote', error: error.message });
  }
};

// Add Lost & Found Post
exports.createLostFound = async (req, res) => {
  try {
    const { title, description, type, contactInfo } = req.body;
    const item = await LostAndFound.create({
      title,
      description,
      type,
      contactInfo,
      postedBy: req.user._id
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error posting item', error: error.message });
  }
};