const querystring = require('node:querystring')
const User = require('../routes/user')
const jwt = require('jsonwebtoken')

exports.createOrLoginUserWithGoogle = async (req, res) => {
    try {
        const { email: newUserEmail } = req.session.passport.user

        const user = await User.findOne({
            email: newUserEmail
        })

        if (user) {
            const { _id, email } = user

            const token = jwt.sign({ _id, email }, process.env.SECRET_JWT)
            return res.send({
                success: true,
                msg: 'inicio de sesión',
                user,
                token
            })
        } else {
            const newUser = await new User({
                email: newUserEmail
            })

            const { email, _id } = newUser
            const token = jwt.sign({ _id, email }, process.env.SECRET_JWT)

            res.send({
                success: true,
                newUser,
                token
            })
        }
    } catch (error) {
        return res.status(404).json({
            success: false,
            msg: 'Ha ocurrido un error'
        })
    }
}

exports.register = async (req, res, next) => {
    if (!req.body.email.includes('@utem.cl')) {
        return res.status(401).json({
            success: false,
            msg: 'Su correo no está autorizado'
        })
    }

    try {
        const user = await User.create(req.body)
        const { _id, email, password } = user
        const token = jwt.sign({ _id, email, password }, process.env.SECRET_JWT)

        res.status(200).json({
            success: true,
            user,
            token
        })
    } catch (error) {
        res.status(404).json({
            error
        })
        next(error)
    }
}

exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        })
        console.log(user)
        const { _id, email } = user
        const checkEmail = await User.comparePassword(req.body.password)
        if (checkEmail) {
            const token = jwt.sign({ _id, email }, process.env.SECRET_JWT)
            return res.json({
                success: true,
                msg: 'Ha iniciado sesión',
                user,
                token
            })
        } else {
            return res.status(404).json({
                success: false,
                msg: 'contraseña incorrecta'
            })
        }
    } catch (error) {
        return res.status(404).json({
            success: false,
            msg: 'Ha ocurrido un error'
        })
    }
}

/// ////////////////////////////////////////

function getGoogleAuthURL() {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccounts'
    const options = {
        redirect_uri: 'http://localhost:8080/api/v1/google/redirect',
        client_id: process.env.GOOGLE_CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ].join(' ')
    }

    return `${rootUrl}?${querystring.stringify(options)}`
}

exports.googleAuth = async (req, res) => {
    const url = await getGoogleAuthURL()
    res.send({
        success: true,
        url
    })
}
