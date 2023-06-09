const User = require('../model/user.model');
const catchAsync = require('../utils/catchAsync');
const { ref, uploadBytes } = require('firebase/storage');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role = 'user' } = req.body;

  const imgRef = ref(storage, `users/${Date.now()}-${req.file.originalname}`);
  const imgUploaded = await uploadBytes(imgRef, req.file.buffer);

  const user = new User({
    name,
    email,
    password,
    role,
    profileImageUrl: imgUploaded.metadata.fullPath,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  await user.save();
  const token = await generateJWT(user.id);

  res.status(201).json({
    status: 'success',
    message: 'The user was create',
    token,
    user: {
      id: user.id,
      name: user.username,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
    },
  });
});
