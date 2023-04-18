import user from '../../../src/model/user'

// createBucket function test
describe('test user model Class', () => {
    
    var testUser = new user("7654321098", "test@test.com")

    it('Should return phone number', async () => {
      expect("7654321098").toEqual(testUser.getPhoneNumber())
    })

    it('Should return Case Name', async () => {
        expect('test@test.com').toEqual(testUser.getEmail())
    })

    
    

    it('Should set Case Name to Testcase', async () => {
        testUser.setPhoneNumber('0123456789')
        expect('0123456789').toEqual(testUser.getPhoneNumber())
    })

    it('Should set Case Description to description test', async () => {
        testUser.setEmail('example@example.com')
        expect('example@example.com').toEqual(testUser.getEmail())
    })
    

  })