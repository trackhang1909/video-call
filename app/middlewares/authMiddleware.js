const { check } = require('express-validator')

class authMiddleware {

    // Validation register
    register = [
        check('fullname')
            .exists({ checkFalsy: true })
            .withMessage("Vui lòng nhập họ tên"),

        check('username')
            .exists({ checkFalsy: true })
            .withMessage("Vui lòng nhập tên người dùng")
            .notEmpty()
            .withMessage("Tên người dùng không được để trống")
            .isLength({ min: 6 })
            .withMessage("Tên người dùng phải nhiều hơn 6 ký tự"),

        check('email')
            .exists({ checkFalsy: true })
            .withMessage("Vui lòng nhập email người dùng")
            .notEmpty()
            .withMessage("Email người dùng không được để trống")
            .isEmail()
            .withMessage("Email không hợp lệ"),

        check('password')
            .notEmpty()
            .withMessage("Vui lòng nhập mật khẩu")
            .isLength({ min: 6 })
            .withMessage("Mật khẩu phải nhiều hơn 6 ký tự"),

        check("confirm_password")
            .exists({ checkFalsy: true, checkNull: true })
            .withMessage("Vui lòng nhập mật khẩu xác nhận")
            .notEmpty()
            .withMessage("Vui lòng nhập mật khẩu xác nhận")
            .custom((value, { req }) => {
                if (value == "") {
                    req.body.password = null;
                }
                if (value !== req.body.password) {
                    throw new Error("Mật khẩu không khớp");
                }
                return true;
            }),
    ]

    // Validation login
    login = [
        check('username')
            .exists({ checkFalsy: true })
            .withMessage("Vui lòng nhập tên người dùng")
            .notEmpty()
            .withMessage("Tên người dùng không được để trống"),

        check('password')
            .exists({ checkFalsy: true })
            .withMessage("Vui lòng nhập mật khẩu")
            .notEmpty()
            .withMessage("Mật khẩu không được để trống"),
    ]
}

module.exports = new authMiddleware();