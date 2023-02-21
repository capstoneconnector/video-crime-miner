const userResponse = (payload = {}) => {


	class user {
		_id?: string | null
		_userName: string
		_firstName: String
		_lastName: String
		_phoneNumber: string
		_email: string
		_password: string

		constructor({id = '', userName = '', firstName = '', lastName = '', phoneNumber = '', email = '', password = ''}) {
			this._id = id
			this._userName = userName
			this._firstName = firstName
			this._lastName = lastName
			this._phoneNumber = phoneNumber
			this._email = email
			this._password = password
		}

		/*Getter Methods*/

		public getId() {
			return this._id
		}

		public getUserName() {
			return this._userName
		}

		public getFirstName() {
			return this._firstName
		}

		public getLastName() {
			return this._lastName
		}

		public getPhoneNumber() {
			return this._phoneNumber
		}

		public getEmail() {
			return this._email
		}

		public getPassword() {
			return this._password
		}

		public setId() {
			return this._id
		}

		/*Setter Methods*/

		public setUserName(userName:string) {
			this._userName = userName
		}

		public setFirstName(firstName: string) {
			this._firstName = firstName
		}

		public setLastName(lastName:string) {
			this._lastName = lastName
		}

		public setPhoneNumber(phoneNumber:string) {
			this._phoneNumber = phoneNumber
		}

		public setEmail(email:string) {
			this._email = email
		}

		public setPassword(password: string) {
			this._password = password
		}

	}

	return new user(payload)

}