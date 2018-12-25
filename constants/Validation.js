export default {
    email: {
        absent: '^ Please enter an email address',
        invalid: '^ Email text isn\'t email form',
        isValid: (email) => {
            return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        }
    },
    
    password: {
        absent: '^ Please enter a password',
        invalid: '^ Password length must be 6-12 characters',
        isValid: (password) => {
            return password.length >= 6 && password.length <= 12
        }
    }
}