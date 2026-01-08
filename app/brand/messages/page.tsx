"use client"

import { useState, useEffect } from "react"
import BrandLayout from "@/components/brand-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"

interface Conversation {
  _id: string
  influencerName: string
  lastMessage: string
  lastMessageAt: string
  unread: boolean
}

export default function BrandMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("/api/messages/conversations", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setConversations(data)
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [])

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConvo) return

    try {
      const token = localStorage.getItem("token")
      await fetch("/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId: selectedConvo,
          content: messageText,
        }),
      })
      setMessageText("")
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  if (loading)
    return (
      <BrandLayout>
        <div>Loading...</div>
      </BrandLayout>
    )

  return (
    <BrandLayout>
      <div className="grid md:grid-cols-3 gap-6 h-[600px]">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {conversations.map((convo) => (
                  <button
                    key={convo._id}
                    onClick={() => setSelectedConvo(convo._id)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedConvo === convo._id ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                    }`}
                  >
                    <p className="font-medium text-sm">{convo.influencerName}</p>
                    <p className="text-xs text-muted-foreground truncate">{convo.lastMessage}</p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          {selectedConvo ? (
            <div className="flex flex-col h-full">
              <CardHeader className="border-b">
                <CardTitle className="text-lg">Influencer Conversation</CardTitle>
              </CardHeader>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs">
                      <p className="text-sm">Hi! Are you interested in our campaign?</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="bg-secondary p-3 rounded-lg max-w-xs">
                      <p className="text-sm">Yes! I'd love to know more details.</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className="border-t p-4 flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send size={18} />
                </Button>
              </div>
            </div>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Select a conversation to view messages</p>
            </CardContent>
          )}
        </Card>
      </div>
    </BrandLayout>
  )
}
