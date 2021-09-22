const CreditCard = require("../models/CreditCard");
const User = require("../models/User");
const ObjectId = require("mongodb").ObjectId;

exports.getCreditCards = async (req, res) => {
  let { id } = req.params;
  try {
    const user = await User.findById(id);
    const creditCards = await CreditCard.find({
      _id: {
        $in: user.creditCards,
      },
    });
    res.status(200).json(creditCards);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

exports.postCreditCard = async (req, res) => {
  let { id } = req.params;
  const { body } = req;

  const newCreditCard = new CreditCard({
    name: body.name,
    number: body.number,
    month: body.month,
    year: body.year,
    cvv: body.cvv,
    funds: body.funds,
  });

  try {
    const card = await newCreditCard.save();
    await User.findByIdAndUpdate(id, {
      $push: { creditCards: ObjectId(card._id) },
    });
    res.status(201).json({ message: "Payment method successfully added!" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

exports.deleteCreditCard = async (req, res) => {
  let { id } = req.params;
  try {
    await CreditCard.findByIdAndDelete(id);
    await User.findByIdAndUpdate(id, {
      $pull: { creditCards: id },
    });
    res.status(200).json({ message: "Payment method successfully removed!" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
