const allowedOrigins = [    
    `http://localhost:3001/`, // front end
    `http://localhost:${process.env.PORT}/`, 
]

module.exports = allowedOrigins;