import {sayHello} from './greet';
import {MyComp} from './app/mycomp';

function hello(compiler:string){
    console.log(`Hello from ${compiler}`);
    let comp = new MyComp();
    comp.show();
}

hello("TypeScript");
console.log(sayHello("TypeScript"));