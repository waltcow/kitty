![koa](http://7sbpcp.com1.z0.glb.clouddn.com/koa-auth.png)

 **Koa** 是NodeJS面向下一代的服务器框架，下面主要介绍如何使用**JWT(json web token)** 保护私有的API


# 什么是 JWT?

 *JWT* 代表JSON web token。 它是一种用于交换安全信息的标准令牌，主要用于身份验证。 JSON web token 体积非常的小，它可以通过下面几种方式传输：


-  通过URL
-  放在POST  的参数中
-  放在HTTP header中

Token 由三部分构成，以 **.** 作为分割符号


- **HEADER** : 包含使用的散列算法和作为JWT的令牌的类型
- **PAYLOAD** : 您想要与凭证交换的信息。 例如在认证令牌的情况下,可以是用户ID及role
- **SIGNATURE**:  用于验证令牌的真实性。 `SIGNATURE` 是使用`HEADER`，`PAYLOAD`和`SECRET KEY`来生成， 因此它可以用于检查`PAYLOAD`没有被改变。

 JWT的格式一般是这样:  `<header>.<payload>.<signature>`

在使用身份认证的场景里，JWT 一般以下面的流程进行的
> 登录授权部分

-  用户发送登录请求，发送身份信息到到服务器鉴权
-  服务器判断用户信息是否合法
-  服务器生成一个TOKEN, 里面包含一些用户相关的信息，用于以后识别该用户
-  服务器对TOKEN进行签名
-  服务器发送TOKEN给用户
-  用户将TOKEN 保存到Cookie 或 Local storage 中

> 用户已授权后的请求场景

- 用户将TOKEN放到请求的header中，以便服务器能识别当前用户的身份
- 服务器拿到请求头部的TOKEN后，decode一次，再提取payload中的信息，识别出该用户
- 服务器进行以后的相关业务逻辑

用户无法改变*PLAYLOAD*里面的数据来伪造其他用户的信息，因为*PLAYLOAD*也是用于生产签名的factor之一，修改后服务器认证将无法通过

*JWT*的身份验证机制的主要优点就是不需要依赖于`SESSION`。

TOKEN像访问卡，它是存储的就是它用户的信息，通常在cookie或local storage。后端不保存已经签发过的TOKEN。

`SECRET KEY` 不与用户共享，它只存储在服务器上，这使得它不太可能被黑客破解。

`JWT` 也比其他SAML令牌体积要小。这使它更适合于在HTML和HTTP环境中传递。

`JWT` 一个主要缺点是，当恶意用户可以拿到别人的一个有效的令牌后,可以直接用别人的TOKEN作为请求，这就是为什么要使用SSL来保护在每个请求上发送的令牌的重要原因。
























