"use client";

import React from "react";
import { MessageSquare, Mic, FileText, Sparkles } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-[var(--color-green)]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <MessageSquare className="w-10 h-10 text-[var(--color-green)]" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-light tracking-tight mb-4">
          Select a meeting to{" "}
          <span className="font-normal text-[var(--color-green)]">
            start chatting
          </span>
        </h1>

        <p className="text-lg text-gray-600 mb-12 max-w-xl mx-auto">
          Choose a meeting from the sidebar or start a new recording to begin
          asking questions and getting AI-powered insights.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Mic className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-medium text-sm mb-1">Record</h3>
            <p className="text-xs text-gray-500">
              Capture your meetings with one click
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-medium text-sm mb-1">Transcribe</h3>
            <p className="text-xs text-gray-500">
              AI-powered accurate transcription
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-medium text-sm mb-1">Ask</h3>
            <p className="text-xs text-gray-500">
              Get instant answers from your meetings
            </p>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-left">
          <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
            <span className="text-blue-600">💡</span>
            Quick Tips
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                Click <strong>&quot;New Meeting&quot;</strong> to start
                recording
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Select any past meeting to ask questions about it</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Use voice or text to interact with the AI</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
