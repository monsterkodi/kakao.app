/*
  000   000  000  00000000  000   000  
  000   000  000  000       000 0 000  
   000 000   000  0000000   000000000  
     000     000  000       000   000  
      0      000  00000000  00     00  
*/

#import "view.h"

@implementation View

-(id) init
{
    WKWebViewConfiguration *config = [[WKWebViewConfiguration alloc] init];
    
    [[config preferences] setValue:@YES forKey:@"developerExtrasEnabled"];
    [[config preferences] setValue:@YES forKey:@"fullScreenEnabled"];
    [[config preferences] setValue:@YES forKey:@"javaScriptCanAccessClipboard"];
    [[config preferences] setValue:@YES forKey:@"DOMPasteAllowed"];
    [config setValue:@YES forKey:@"allowUniversalAccessFromFileURLs"];

    if (self = [super initWithFrame:CGRectMake(0,0,0,0) configuration:config])
    {
        [self setValue:@NO forKey:@"drawsBackground"];
    }
    
    [self initScripting];
    
    return self;
}

-(void) mouseDown:(NSEvent *)event 
{
    // NSLog(@"mouseDown %@", event);    
    NSPoint   viewLoc = [self convertPoint:event.locationInWindow fromView:nil];
    NSString *docElem = [NSString stringWithFormat:@"document.elementFromPoint(%f, %f)", viewLoc.x, viewLoc.y];
    NSString *jsCode  = [NSString stringWithFormat:@"%@.classList.contains(\"app-drag-region\")", docElem];
    
    [self evaluateJavaScript:jsCode completionHandler:
        ^(id result, NSError * error) {
            if (error) NSLog(@"%@", error);
            else 
            {
                if ([[NSNumber numberWithInt:1] compare:result] == NSOrderedSame)
                {
                    [self.window performWindowDragWithEvent:event];
                }
            }
    }];
    
    [super mouseDown:event];
}

-(void) initScripting
{
    WKUserContentController* ucc = [[self configuration] userContentController];
    
    [ucc addScriptMessageHandler:self name:@"kakao"];
    id world = [WKContentWorld worldWithName:@"kakao"];
    [ucc addScriptMessageHandlerWithReply:self contentWorld:world name:@"kakao_get"];
}

- (void) userContentController:(WKUserContentController *)ucc didReceiveScriptMessage:(WKScriptMessage *)msg
{
    NSLog(@"script message: %@ %@", msg.name, msg.body);
}

- (void) userContentController:(WKUserContentController *)ucc didReceiveScriptMessage:(WKScriptMessage *)msg replyHandler:(void (^)(id reply, NSString *errorMessage))replyHandler
{
    NSLog(@"reply to message: %@ %@ %@", msg.name, msg.world.name, msg.body);
    replyHandler(@"pong", nil);
}

@end