const models = require("../../models/index");

class LearningStatus {
  constructor() {
    this.LearningStatus = models.Learning_Status;
  }

  async findAll() {
    const learningStatuses = await this.LearningStatus.findAll();
    return learningStatuses.length ? learningStatuses : [];
  }
}

module.exports = LearningStatus;
