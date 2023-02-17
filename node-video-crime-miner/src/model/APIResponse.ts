/* Provides a definition for an API response to standardize API responses */
const standardizeResponse = (payload = {}) => {

    class APIResponse {

        _data: {}
        _success: boolean
        _errors: any[]
        _message: string
        _timestamp: string

        constructor({data = {}, success = false, errors = Array(), message = "",}) {
            this._data = data
            this._success = success
            this._errors = errors
            this._message = message
            const timestamp = new Date(Date.now()).toUTCString()
            this._timestamp = timestamp
        }

        public convertToJson() {
            return {
                success: this._success,
                errors: this._errors,
                message: this._message,
                data: this._data,
                timestamp: this._timestamp
            }
        }

        /* Getter Methods */

        public getData() {
            return this._data
        }

        public getSuccess() {
            return this._success
        }

        public getErrors() {
            return this._errors
        }
        
        public getMessage() {
            return this._message
        }
        
        public getTimeStamp(){
            return this._timestamp
        }

        /* Setter Methods */

        public setData(data:{}) {
            this._data = data
        }

        public setSuccess(success: boolean) {
            this._success = success
        }

        public setErrors(errors: any[]) {
            this._errors = errors
        }
        
        public setMessage(message: string) {
            this._message = message
        }
    }

    return new APIResponse(payload)
}

export { standardizeResponse }