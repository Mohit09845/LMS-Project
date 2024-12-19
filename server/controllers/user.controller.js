import User from '../model/user.model.js';
import bcrypt from 'bcryptjs';


export const register = async(req,res) =>{
    try {
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            throw
        }
        const user = await User.findOne({email});

        if(user){

        }

        const hashedPassword = await bcrypt.hash(password,10);

        await User.create({
            name,
            email,
            password: hashedPassword
        })

        return res.status(201).json({
            
        })

    } catch (error) {
        
    }
}