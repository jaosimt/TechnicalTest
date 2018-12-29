export default {
    email: {
        absent: 'please enter an email address',
        invalid: 'not correct format for email address',
        isValid: (email) => {
            return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        }
    },
    
    password: {
        absent: 'please enter a password',
        invalid: 'please use at least 1 - 12 characters',
        isValid: (password) => {
            return password.length >= 1 && password.length <= 12
        }
    }
}