const jwt = require('jsonwebtoken')
const authToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, process.env.SECRET_JWT, (error, decoded) => {
            if (error) {
                return res.status(404).json({
                    success: false,
                    msg: 'Error en la autenticación'
                })
            } else {
                req.decoded = decoded
                next()
            }
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            msg: 'No ha otorgado un token válido o este está vacío'
        })
    }
}
module.exports = authToken