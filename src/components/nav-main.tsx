'use client';

import {
  ChevronRight,
  FileText,
  Folder,
  MoreHorizontal,
  Share,
  Trash2,
  type LucideIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useCVRStore } from '@/lib/store';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { isMobile } = useSidebar();
  const responses = useCVRStore((state) => state.responses);
  const removeResponse = useCVRStore((state) => state.removeResponse);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Searches</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url}>
                  <item.icon />
                  <span>
                    {item.title} {item.title === 'Recent' && `(${responses.length})`}
                  </span>
                </a>
              </SidebarMenuButton>
              {item.title === 'Recent' && (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {responses.map((response) => (
                        <SidebarMenuSubItem
                          key={response.data.stamdata?.cvrnummer || 'unknown'}
                          className="group/item"
                        >
                          <SidebarMenuSubButton asChild className="py-4">
                            <a href="#" className="flex items-center">
                              <FileText className="size-3.5" />
                              <span className="flex min-w-0 flex-col">
                                <span className="shrink-0">
                                  {response.data.stamdata?.cvrnummer}
                                </span>
                                <span className="text-muted-foreground text-[0.60rem] truncate">
                                  {response.data.stamdata?.navn}
                                </span>
                              </span>
                            </a>
                          </SidebarMenuSubButton>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <SidebarMenuAction className="opacity-0 group-hover/item:opacity-100 data-[state=open]:opacity-100">
                                <MoreHorizontal />
                                <span className="sr-only">More</span>
                              </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              className="w-48"
                              side={isMobile ? 'bottom' : 'right'}
                              align={isMobile ? 'end' : 'start'}
                            >
                              <DropdownMenuItem>
                                <Folder className="text-muted-foreground" />
                                <span>View Details</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share className="text-muted-foreground" />
                                <span>Share</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  response.data.stamdata?.cvrnummer &&
                                  removeResponse(response.data.stamdata.cvrnummer)
                                }
                              >
                                <Trash2 className="text-muted-foreground" />
                                <span>Remove</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              )}
              {item.items?.length && item.title !== 'Recent' ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title} className="group/item">
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <SidebarMenuAction className="opacity-0 group-hover/item:opacity-100 data-[state=open]:opacity-100">
                                <MoreHorizontal />
                                <span className="sr-only">More</span>
                              </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              className="w-48"
                              side={isMobile ? 'bottom' : 'right'}
                              align={isMobile ? 'end' : 'start'}
                            >
                              <DropdownMenuItem>
                                <Folder className="text-muted-foreground" />
                                <span>View {subItem.title}</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share className="text-muted-foreground" />
                                <span>Share {subItem.title}</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Trash2 className="text-muted-foreground" />
                                <span>Delete {subItem.title}</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
