class user {
	_phoneNumber: string
	_email: string

	constructor(phoneNumber:string, email:string) {
		this._phoneNumber = phoneNumber
		this._email = email
	}
	

	/*Getter Methods*/

	public getPhoneNumber() {
		return this._phoneNumber
	}

	public getEmail() {
		return this._email
	}

	/*Setter Methods*/

	public setPhoneNumber(phoneNumber:string) {
		this._phoneNumber = phoneNumber
	}

	public setEmail(email:string) {
		this._email = email
	}

}