import express from "express";
import jwt, {Secret} from "jsonwebtoken";
import process from "process";

export const verifyToken = (req: express.Request, res: any, next: express.NextFunction) => {
//methana res eka any damme response onject ekata api athin data ekak dana nisa
//eka nisa ilaga method eketh res eka any karanna ona

    let authorizationToken= req.headers.authorization;
    // console.log(authorizationToken);

    if (!authorizationToken) {
        return res.status(401).json("Invalid Token");
    }

    try {
        // let verifiedData = jwt.verify(authorizationToken,process.env.SECRET as Secret);
        // res.tokenData = verifiedData;
        res.tokenData = jwt.verify(authorizationToken,process.env.SECRET as Secret);
        next();
    }catch (error) {
        return res.status(401).json("Invalid Token");
    }

}