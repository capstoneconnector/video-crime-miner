/* Provides a definition for an API response to standardize API responses */
const standardizeResponse = (payload = {}) => {

    class APIResponse {

        _data: {}
        _status: number
        _errors: any[]
        _message: string
        _timestamp: string

        constructor({data = {}, status = 0, errors = Array(), message = "",}) {
            this._data = data
            this._status = status
            this._errors = errors
            this._message = message
            const now = new Date
            const timestamp = Date.UTC(
                now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() , 
                now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds())
            this._timestamp = timestamp.toString()
        }

        public convertToJson() {
            return {
                status: this._status,
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

        public getStatus() {
            return this._status
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

        public setStatus(status: number) {
            this._status = status
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