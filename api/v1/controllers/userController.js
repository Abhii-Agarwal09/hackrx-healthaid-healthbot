import { createAccessToken } from '../middleware/auth';
import User from '../models/UserModel';

const createUser = async (req) => {
  // extract data from req body
  const {
    email,
    name,
    avatarURL,
    age,
    gender,
    weight,
    height,
    bloodGrp,
    sources,
  } = req.body;
  try {
    // calculate bmi - weight (kg) / height (m) squared
    const BMI = (weight / Math.pow(height, 2)).toFixed(2);
    const user = new User(
      email,
      name,
      avatarURL,
      age,
      gender,
      weight,
      height,
      BMI,
      bloodGrp,
      sources
    );
    await user.save();
    // generate token - payload -> user id and email
    const token = createAccessToken({ uid: user._id, email: user.email });
    console.log(token);
    // return user
    return user;
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      responseText: 'There was an error',
      msg: error.msg,
      error,
    });
  }
};

const loginUser = async (req, res) => {
  // get data from req body
  const { email } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (user) {
      return res.json({
        success: true,
        responseText: 'user already exists, logging in',
        data: user,
      });
    }
    user = createUser(req);
    res.json({
      success: true,
      responseText: 'user created',
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      responseText: 'There was an error',
      msg: error.msg,
      error,
    });
  }
};

export default { createUser, loginUser };
