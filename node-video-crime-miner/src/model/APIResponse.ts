/* Provides a definition for an API response to standardize API responses */
const standardizeResponse = (payload = {}) => {

    class APIResponse {

        private _data: {}
        private _success: boolean
        private _errors: any[]
        private _message: string
        private _timestamp: string

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

        public getData(): {} {
            return this._data
        }

        public getSuccess(): boolean {
            return this._success
        }

        public getErrors(): any[] {
            return this._errors
        }
        
        public getMessage(): string {
            return this._message
        }
        
        public getTimeStamp(): string {
            return this._timestamp
        }

        /* Setter Methods */

        public setData(data:{}): void {
            this._data = data
        }

        public setSuccess(success: boolean): void {
            this._success = success
        }

        public setErrors(errors: any[]): void {
            this._errors = errors
        }
        
        public setMessage(message: string): void {
            this._message = message
        }
    }

    return new APIResponse(payload)
}

export { standardizeResponse }