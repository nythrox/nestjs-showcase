export class UserModel {

    public readonly id : number
    public readonly username : String
    public readonly email : String
    public readonly password : String
    public readonly roles : String[]
    constructor(user : UserModel){
        this.id = user.id
        this.username = user.username
        this.email = user.email 
        this.password = user.password
        this.roles = user.roles
    }
}